## template
template是客户端的入口文件，js/css的引用在template中通过${require('xx')}的方式引用，{{placeholder}}用于服务端状态的渲染，暂时不支持ssr，后续支持。