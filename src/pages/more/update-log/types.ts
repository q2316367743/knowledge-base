export interface TxcUpdateLog {
    status: number;
    message?: any;
    pagination: Pagination;
    object: string;
    data: Record<string, TxcUpdateLogData>;
}

export interface TxcUpdateLogData {
    id: string;
    user_id: number;
    avatar_url: string;
    nick_name: string;
    content: string;
    images: any[];
    created_at: string;
    created_at_timestamp: number;
    time: string;
    is_admin: boolean;
    is_top: boolean;
    is_locked: boolean;
    is_good: boolean;
    like_count: number;
    reply_count: number;
    location: string;
    type: number;
    like_list: any[];
    list_id: string;
    is_notice: boolean;
    replies: Record<string, Replies>;
}


interface Replies {
    f_reply_id: string;
    f_reply_text: string;
    created_at: string;
    created_at_timestamp: number;
    images: any[];
    user_id: number;
    avatar_url: string;
    nick_name: string;
    is_admin: boolean;
    like_count: number;
    parent_reply_id: string;
    group_name: string;
    postname: string;
}

interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    has_more_pages: boolean;
    from: number;
    to: number;
    next_page_url: string;
    prev_page_url?: any;
    next_page_id: string;
    prev_page_id: string;
}
