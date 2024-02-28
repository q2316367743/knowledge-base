/**
 * 一篇笔记
 */
export interface NoteIndex {

    id: number;

    /**
     * 更新时间
     */
    updateTime: number;

    /**
     * 是否置顶
     */
    top: boolean;

    /**
     * 是否被删除
     */
    deleted: boolean;

}


export interface NoteContent extends NoteIndex {

    /**
     * 内容
     */
    content: string;

    /**
     * 关联笔记
     */
    relationNotes: Array<NoteRelation>;

    /**
     * 标签
     */
    tags: Array<string>;

}

export interface NoteRelation {

    /**
     * 笔记ID
     */
    noteId: number;

    /**
     * 关联ID
     */
    relationId: number;

    /**
     * 类型：
     * COMMENT：评论
     * REFERENCE：引用
     */
    type: NoteRelationType;

}

export type NoteRelationType = 'COMMENT' | 'REFERENCE';

