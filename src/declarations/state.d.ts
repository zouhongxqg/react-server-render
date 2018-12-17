/// <reference path="./thrift.d.ts" />

declare type HomePageState = {
  title: string,
}

declare type ContentMap = Array<CommonContentTO[]>

declare type ProductGuidePageState = {
  modules: CommonModuleTO[],
  subModules: CommonModuleTO[],
  contentMap: ContentMap,
}

declare type SearchVideoState = {
  searchResult: EagleDataTO,
}

declare type FAQPageState = {
  modules: CommonModuleTO[],
  content: CommonContentTO[]
}

declare type SearchFAQState = {
  searchResult: EagleDataTO,
}

declare type FAQDetailState = {
  content: CommonContentTO,
}
declare type PageStates = FAQPageState | ProductGuidePageState | HomePageState | null | {};
