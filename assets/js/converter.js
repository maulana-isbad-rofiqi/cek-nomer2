/**
 * V2Ray Converter Module
 * Handles V2Ray link parsing and conversion to Clash/JSON format
 */

const V2RayConverter = {
  /**
   * Parse V2Ray link (vmess, vless, trojan, ss)
   * @param {string} link - V2Ray link
   * @returns {object|null} - Parsed proxy object
   */
  parseV2rayLink(link) {
    try {
      if (link.startsWith('vmess://')) {
        return this.parseVmess(link);
      } else if (link.startsWith('vless://')) {
        return this.parseVless(link);
      } else if (link.startsWith('trojan://')) {
        return this.parseTrojan(link);
      } else if (link.startsWith('ss://')) {
        return this.parseShadowsocks(link);
      } else {
        console.warn('Format link tidak didukung:', link);
        return null;
      }
    } catch (e) {
      console.error('Gagal parse link:', link, e);
      return null;
    }
  },

  parseVmess(link) {
    const base64String = link.substring(8);
    const paddedBase64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(paddedBase64);
    const json = JSON.parse(decoded);

    let wsOpts = undefined;
    if (json.net === 'ws') {
      wsOpts = {
        path: json.path || '/',
        headers: {}
      };
      if (json.host) {
        wsOpts.headers.Host = json.host;
      }
    }

    let grpcOpts = undefined;
    if (json.net === 'grpc') {
      grpcOpts = {
        'grpc-service-name': json.path || ''
      };
    }

    return {
      name: json.ps || json.add,
      type: 'vmess',
      server: json.add,
      port: parseInt(json.port),
      uuid: json.id,
      alterId: parseInt(json.aid) || 0,
      cipher: json.type || 'auto',
      tls: json.tls === 'tls' || parseInt(json.port) === 443,
      sni: json.sni || json.host || '',
      network: json.net || 'tcp',
      'ws-opts': wsOpts,
      'grpc-opts': grpcOpts
    };
  },

  parseVless(link) {
    const url = new URL(link);
    const params = url.searchParams;

    let wsOpts = undefined;
    if (params.get('type') === 'ws') {
      wsOpts = {
        path: params.get('path') || '/',
        headers: {}
      };
      if (params.get('host')) {
        wsOpts.headers.Host = params.get('host');
      }
    }

    let grpcOpts = undefined;
    if (params.get('type') === 'grpc') {
      grpcOpts = {
        'grpc-service-name': params.get('serviceName') || ''
      };
    }

    return {
      name: decodeURIComponent(url.hash.substring(1)) || url.hostname,
      type: 'vless',
      server: url.hostname,
      port: parseInt(url.port),
      uuid: url.username,
      tls: params.get('security') === 'tls',
      sni: params.get('sni') || '',
      network: params.get('type') || 'tcp',
      flow: params.get('flow') || undefined,
      'ws-opts': wsOpts,
      'grpc-opts': grpcOpts
    };
  },

  parseTrojan(link) {
    const url = new URL(link);
    const params = url.searchParams;

    let wsOpts = undefined;
    if (params.get('type') === 'ws') {
      wsOpts = {
        path: params.get('path') || '/',
        headers: {}
      };
      if (params.get('host')) {
        wsOpts.headers.Host = params.get('host');
      }
    }

    let grpcOpts = undefined;
    if (params.get('type') === 'grpc') {
      grpcOpts = {
        'grpc-service-name': params.get('serviceName') || ''
      };
    }

    return {
      name: decodeURIComponent(url.hash.substring(1)) || url.hostname,
      type: 'trojan',
      server: url.hostname,
      port: parseInt(url.port),
      password: url.username,
      tls: true,
      sni: params.get('sni') || url.hostname,
      network: params.get('type') || 'tcp',
      'ws-opts': wsOpts,
      'grpc-opts': grpcOpts
    };
  },

  parseShadowsocks(link) {
    const mainPart = link.substring(5).split('#')[0];
    const name = decodeURIComponent(link.split('#')[1] || '');

    let credentialsPart, serverPart;

    try {
      const paddedBase64 = mainPart.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(paddedBase64);
      [credentialsPart, serverPart] = decoded.split('@');
    } catch (e) {
      [credentialsPart, serverPart] = mainPart.split('@');
    }

    const [server, port] = serverPart.split(':');
    const [cipher, password] = credentialsPart.split(':');

    return {
      name: name || server,
      type: 'ss',
      server: server,
      port: parseInt(port),
      cipher: cipher,
      password: password
    };
  },

  /**
   * Create full Clash configuration
   * @param {array} proxies - Array of proxy objects
   * @returns {string} - YAML string
   */
  createFullClashConfig(proxies) {
    const proxyNames = proxies.map(p => p.name);

    const config = {
      'port': 7890,
      'socks-port': 7891,
      'allow-lan': false,
      'mode': 'rule',
      'log-level': 'info',
      'external-controller': '127.0.0.1:9090',
      'dns': {
        'enable': true,
        'listen': '0.0.0.0:53',
        'nameserver': ['1.1.1.1', '8.8.8.8'],
        'fallback': []
      },
      'proxies': proxies,
      'proxy-groups': [
        {
          'name': 'PROXY',
          'type': 'select',
          'proxies': ['DIRECT', ...proxyNames]
        }
      ],
      'rules': [
        'MATCH,PROXY'
      ]
    };

    return jsyaml.dump(config);
  },

  /**
   * Convert links to specified format
   * @param {array} links - Array of V2Ray links
   * @param {string} format - Output format (json, clash_proxies, clash_full)
   * @returns {string} - Converted output
   */
  convert(links, format) {
    const proxies = links.map(link => this.parseV2rayLink(link)).filter(Boolean);

    if (proxies.length === 0) {
      throw new Error('Tidak ada link valid yang bisa diparse.');
    }

    switch (format) {
      case 'json':
        return JSON.stringify(proxies, null, 2);

      case 'clash_proxies':
        return jsyaml.dump({ 'proxies': proxies });

      case 'clash_full':
        return this.createFullClashConfig(proxies);

      default:
        throw new Error('Format tidak dikenal');
    }
  }
};
