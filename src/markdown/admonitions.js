const admonitionTypes = [
    'abstract',
    'attention',
    'bug',
    'caution',
    'danger',
    'error',
    'example',
    'failure',
    'hint',
    'info',
    'note',
    'question',
    'quote',
    'success',
    'tip',
    'warning'
  ],
  startReg = new RegExp(`^!!!\\s+(${admonitionTypes.join('|')})(?:\\s+)?(.*)$`),
  // /^!!!\s+(note|abstract|info|tip|success|question|warning|failure|danger|bug|example|quote|hint|caution|error|attention)\s+(.*)$/
  endReg = /^!!!\s*$/,
  debug = false,
  defaultOptions = { nodeName: 'div', className: 'admonition', title: { nodeName: 'p' } }

export function admonitions(options = {}) {
  options = {
    ...defaultOptions,
    ...options
  }

  return {
    extensions: [
      {
        name: 'admonition',
        level: 'block',
        start(src) {
          const index = src.match(
            new RegExp(`(^|[\\r\\n])!!!\\s+(${admonitionTypes.join('|')})(?:\\s+)?(.*)`)
          )?.index
          debug && console.log('🎋[marked start]', src, index)
          return index
        },
        tokenizer(src, _tokens) {
          debug && console.log('🗼[marked tokenizer]', src, _tokens)
          const lines = src.split(/\n/)
          if (startReg.test(lines[0])) {
            const section = { x: -1, y: -1 }
            const sections = []
            for (let i = 0, k = lines.length; i < k; i++) {
              if (startReg.test(lines[i])) {
                section.x = i
              } else if (endReg.test(lines[i])) {
                section.y = i
                if (section.x >= 0) {
                  sections.push({ ...section })
                  section.x = -1
                  section.y = -1
                }
              }
            }

            if (sections.length) {
              const section = sections[0]
              const [_, icon, title] = startReg.exec(lines[section.x]) || []
              const text = lines.slice(section.x + 1, section.y).join('\n')
              const raw = lines.slice(section.x, section.y + 1).join('\n')
              const token = {
                type: 'admonition',
                raw,
                icon,
                title,
                text,
                titleTokens: [],
                tokens: [],
                childTokens: ['title', 'text']
              }

              this.lexer.inlineTokens(token.title, token.titleTokens)
              this.lexer.blockTokens(token.text, token.tokens)
              return token
            }
          }
        },
        renderer(token) {
          debug && console.log('🐉[marked renderer]', this, token)
          const html = `<${options.nodeName} class="${options.className} ${options.className}-${
            token.icon
          }">
          <${options.title.nodeName} class="${options.className}-title">${this.parser.parseInline(
            token.titleTokens,
            null
          )}</${options.title.nodeName}>
          ${this.parser.parse(token.tokens)}
          </${options.nodeName}>`
          return html
        }
      }
    ]
  }
}
