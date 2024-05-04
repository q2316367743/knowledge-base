export interface CustomerFileNameSetting {

    id: number;

    folderId: number;

    script: string;

}

export function createCustomerFileNameSetting(): CustomerFileNameSetting {
    return {
        id: new Date().getTime(),
        folderId: 0,
        script: '',
    }
}
