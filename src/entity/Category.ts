import {ListTree} from "@/entity/ListTree";

export default interface Category extends ListTree{


    /**
     * 创建时间
     */
    createTime: Date | string;

    /**
     * 更新时间
     */
    updateTime: Date | string;

}
