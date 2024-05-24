//
import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import { buildConfig } from 'payload/config'
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import { bunnyStorage } from './adapter-bunny-storage'

import Users from './collections/Users'
import Media from './collections/Media'
const mockModulePath = path.resolve(__dirname, 'mocks', 'emptyFunction.js')

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_EXTERNAL_SERVER_URL,
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          ...config.resolve.alias,
          fs: mockModulePath,
          //... add all server only modules
        }
      }
    }),
  },
  editor: slateEditor({}),
  cors: process.env.WHITELIST_ORIGINS ? process.env.WHITELIST_ORIGINS.split(',') : [],
  csrf: process.env.WHITELIST_ORIGINS ? process.env.WHITELIST_ORIGINS.split(',') : [],
  collections: [
    Users,
    Media,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    disable: true
  },
  plugins: [
    payloadCloud(),
    cloudStorage({
      collections: {
        [Media.slug]: {
          adapter: bunnyStorage({
            zone: process.env.BUNNY_ZONE,
            region: "",
            accessKey: process.env.BUNNY_ACCESS_KEY,
            pullZone: new URL("https://boilerplatewwa.b-cdn.net/"),
          }),
          disablePayloadAccessControl: true,
        }
      }
    })
    
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})
