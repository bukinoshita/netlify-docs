'use strict'

const getDocs = require('./../get-docs')

module.exports = async () => {
  const files = await getDocs()
  const items = files.map(item => item.substring(3).replace('.md', ''))

  return `
  'use strict'

  import React from 'react'
  import Header from './../components/header'
  import Sidebar from './../components/sidebar'
  import Footer from './../components/footer'
  import { name, description } from './../../package.json'

  const Page = ({ children }) => {
    return (
      <div className="wrapper">
        <main className="container">
          <Header title={name} description={description} />

          <div className="content-wrapper">
            <Sidebar items={[${"'" + items.join("', '") + "'"}]} />
            <div className="content">
              {children}
            </div>
          </div>

          <Footer />
        </main>
      </div>
    )
  }
  export default Page
  `
}
