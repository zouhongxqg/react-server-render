/// <reference types='react'/>

declare module '*.png' {
  const content: string;
  export = content;
}

declare module '*.async' {
  const content: {
    // tslint:disable-next-line:no-any
    [k: string]: React.ComponentClass<any>
  }
  export = content;
}

declare module 'react-paginate'
declare var TouchSlide: (a: object) => void

declare interface ServerRenderContext {
    url?: string,
    dependences: { [k: string]: boolean}
    serverRending: boolean,
}

declare var YKUPlayer: {
  new (name: string, options: {
    styleid: string,
    client_id: string,
    vid: string,
    newPlayer: boolean,
    autoplay: boolean,
    show_related: boolean,
  }): void;
}

declare var YKU: {
  Player: typeof YKUPlayer,
};

declare type Paginate = {
  selected: number,
}

declare function LXAnalytics (pageView: string,
  valLab: Object,
  environment: Object,
  cId: string): void;

declare function LXAnalytics (pageView: string,
  bid: string,
  valLab: Object): void;

declare var valLab: Object;
declare var environment: Object;
