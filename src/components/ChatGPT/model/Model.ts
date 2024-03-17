export interface ListModel {
    data: Datum[];
    object: string;
}

export interface Datum {
    id: string;
    object: string;
    created: number;
    owned_by: string;
    permission: Permission[];
    root: string;
    parent?: any;
}

interface Permission {
    id: string;
    object: string;
    created: number;
    allow_create_engine: boolean;
    allow_sampling: boolean;
    allow_logprobs: boolean;
    allow_search_indices: boolean;
    allow_view: boolean;
    allow_fine_tuning: boolean;
    organization: string;
    group?: any;
    is_blocking: boolean;
}
