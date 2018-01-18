import Events from './Events'

const trackedLinks = document.querySelectorAll('[data-ga-track]')

trackedLinks.forEach(item => {
  const url = item.getAttribute('href')
  item.addEventListener('click', e => {
    e.preventDefault()
    ga('send', 'event', 'outbound', 'click', url, {
      'transport': 'beacon',
      'hitCallback': function () { document.location = url }
    })
  })
})

ga('send', 'event', 'x0x_001', 'loaded')

Events.emitter.on('start', () => {
  ga('send', 'event', 'x0x_001', 'started')
})

Events.emitter.on('prog-3', () => {
  ga('send', 'event', 'x0x_001', 'half played')
})

Events.emitter.on('end', () => {
  ga('send', 'event', 'x0x_001', 'ended')
})
