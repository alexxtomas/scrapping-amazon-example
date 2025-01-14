#!/usr/bin/env node
/* eslint-disable camelcase */
import puppeteer from 'puppeteer'
import { connectToDb } from './logic/db/db_connection.js'
import { saveDataToDb } from './logic/db/save_data_to_db.js'
import { extractVideoToSearch } from './logic/extract_video_to_search.js'
import { formatData } from './logic/format_data.js'
import { log } from './logic/log.js'
;(async () => {
  const { videoToSearch, formattedVideoToSearch } = extractVideoToSearch()

  // EXAMPLE, PASTE HERE YOUR URI
  const URI = `mongodb+srv://root:root@cluster0.xmqbgxh.mongodb.net/${formattedVideoToSearch}?retryWrites=true&w=majority`

  log({ message: 'Configuring the browser' })

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  })

  log({ message: 'Opening the browser' })
  const page = await browser.newPage()

  log({ message: 'Going to youtube' })
  await page.goto('https://www.youtube.com')

  log({ message: 'Accepting youtube cookies' })
  const acceptAllButton = await page.waitForSelector(
    'button[aria-label="Accept the use of cookies and other data for the purposes described"]'
  )
  await acceptAllButton.click()

  await page.waitForNavigation()
  log({ message: 'Typing in the serach bar' })
  const searchInput = await page.$('input#search')

  await searchInput.type(videoToSearch)

  log({ message: 'Clicking on the search button' })
  await page.waitForFunction(`document.querySelector('input#search').value === '${videoToSearch}'`)

  await page.click('button#search-icon-legacy')

  await page.waitForNavigation()
  log({ message: 'Selecting the videos' })
  const videos = await page.evaluate(() => {
    const videoElements = document.querySelectorAll('.ytd-video-renderer #video-title')
    const videos = []
    videoElements.forEach(({ textContent, href: link }) => {
      const title = textContent.replace(/\n/g, '').trim()
      videos.push({ title, link })
    })
    return videos
  })

  const totalVideos = videos.length
  log({ message: `${totalVideos} selected` })
  if (!totalVideos) {
    log({ message: 'Something went wrong, please try again ❌', err: true })
    process.exit(1)
  }
  log({ message: 'Formatting all the videos. This may take a while, please wait.' })

  const authors = []

  await formatData({ authors, videos })
  log({ message: 'Videos formatted successfully!' })
  log({ message: 'Connecting to database...' })

  await connectToDb(URI)

  log({ message: 'Saving videos to database!. This may taye a while, please wait.' })
  await saveDataToDb({ authors, videos })
  log({ message: 'Finsihed the scraping' })
  setTimeout(() => {
    process.exit(1)
  }, 3000)
})()
