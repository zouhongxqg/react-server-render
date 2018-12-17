type Int64 = string;
declare enum ModuleType {
    PRODUCT_HELP = 1,
    FAQ = 2,
}

declare class CommonModuleTO {
    id?: number;
    parentId?: number;
    childModules?: CommonModuleTO[];
    name: string;
    rank?: number;
    level?: number;
    type?: ModuleType;

    constructor(arg?: {
        id?: number;
        parentId?: number;
        childModules?: CommonModuleTO[];
        name: string;
        rank?: number;
        level?: number;
        type?: ModuleType;
    })
}

declare class CommonContentTO {
    id?: number;
    moduleId?: number;
    name: string;
    content: string;
    attachment?: string;
    rank?: number;
    used?: number;
    unused?: number;

    constructor(arg?: {
        id?: number;
        moduleId?: number;
        name: string;
        content: string;
        attachment?: string;
        rank?: number;
        used?: number;
        unused?: number;
    })
}

declare class ContentUsedTO {
    contentId: number;
    used: number;
    unused: number;

    constructor(arg?: {
        contentId: number;
        used: number;
        unused: number;
    })
}

declare class EagleMetaDataTO {
    contentId: number;
    name: string;
    content: string;
    attachment?: string;

    constructor(arg?: {
        contentId: number;
        name: string;
        content: string;
        attachment?: string;
    })
}

declare class EagleDataTO {
    total: Int64;
    eagleMetaDatas: EagleMetaDataTO[];

    constructor(arg?: {
        total: Int64;
        eagleMetaDatas: EagleMetaDataTO[];
    })
}

declare class CommonResponse {
    msg: string;
    code: number;

    constructor(arg?: {
        msg: string;
        code: number;
    })
}

