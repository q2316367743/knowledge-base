
export interface ZoneBase {

    /**
     * 地点
     */
    location: string;

    /**
     * 标签
     */
    tags: Array<string>;


}

export function getDefaultZoneBase(): ZoneBase {
    return {
        location:'',
        tags: [],
    }
}
