
import { createStartHandler, defaultRenderHandler } from '@tanstack/react-start/server'
import { createRouter } from './router'

// For now, use a simple handler without manifest
export default createStartHandler({
  createRouter,
})(defaultRenderHandler)
