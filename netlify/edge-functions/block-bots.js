const botUas = [
    'AdsBot',
    'AdsBot-Google',
    'Amazonbot',
    'anthropic-ai',
    'Applebot',
    'Applebot-Extended',
    'AwarioRssBot',
    'AwarioSmartBot',
    'Bytespider',
    'CCBot',
    'ChatGPT',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'cohere-ai',
    'DataForSeoBot',
    'Diffbot',
    'FacebookBot',
    'FriendlyCrawler',
    'facebookexternalhit',
    'Google-Extended',
    'Googlebot',
    'Googlebot-Image',
    'GoogleOther',
    'GoogleOther-Image',
    'GoogleOther-Video',
    'GPTBot',
    'ICC-Crawler',
    'ImageSift',
    'ImagesiftBot',
    'img2dataset',
    'magpie-crawler',
    'Mediapartners-Google*',
    'Meta-ExternalAgent',
    'OAI-SearchBot',
    'omgili',
    'omgilibot',
    'peer39_crawler',
    'peer39_crawler/1.0',
    'PerplexityBot',
    'PetalBot',
    'Scrapy',
    'Timpibot',
    'VelenPublicWebCrawler',
    'YouBot',
  ]
  
  export default async (request, context) => {
    const ua = request.headers.get('user-agent');
  
    let isBot = false
  
    botUas.forEach(u => {
      if (ua.toLowerCase().includes(u.toLowerCase())) {
        isBot = true
      }
    })
  
    const response = isBot ? new Response(null, { status: 401 }) : await context.next();
    return response
  };