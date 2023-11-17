import {EditorDriver} from "@/entity/editor/EditorDriver";
import {defineStore} from "pinia";
import {getItemByDefault, listByAsync, saveListByAsync, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {TreeNodeData} from "@arco-design/web-vue";
import DefaultArticleServiceImpl from "@/pages/editor/driver/impl/DefaultArticleServiceImpl";
import {ArticleService} from "@/pages/editor/driver/ArticleService";
import EditorDriverTypeEnum from "@/enumeration/EditorDriverTypeEnum";
import {FileArticleServiceImpl} from "@/pages/editor/driver/impl/FileArticleServiceImpl";

let isInit = false;

export const useEditorDriverStore = defineStore('editor-driver', {
    state: () => ({
        drivers: new Array<EditorDriver>(),
        rev: undefined as string | undefined,
        // 子节点
        itemsMap: new Map<string, Array<TreeNodeData>>(),
        // 当前节点
        selectKey: '',
        service: new DefaultArticleServiceImpl() as ArticleService,

        // 驱动ID
        driverId: getItemByDefault<number>(LocalNameEnum.KEY_EDITOR_DRIVER_ID, 0),


        collapsed: false,
        widthWrap: getItemByDefault<string>(LocalNameEnum.KEY_EDITOR_WIDTH, '264px')
    }),
    getters: {
        width: (state): string => {
            if (state.collapsed) {
                return '0px';
            } else {
                return state.widthWrap
            }
        },
        rootPath: state => {
            if (state.driverId > 0) {
                const index = state.drivers.findIndex(e => e.id === state.driverId);
                if (index > -1) {
                    return state.drivers[index].path;
                }
            }
            return "";
        }
    },
    actions: {
        async init(): Promise<boolean> {
            if (isInit) {
                return false;
            }
            isInit = true;
            const res = await listByAsync<EditorDriver>(LocalNameEnum.EDITOR);
            this.drivers = res.list;
            this.rev = res.rev;
            if (this.driverId > 0) {
                await this.setEditorDriver(this.driverId);
            }
            return true;
        },
        async _sync() {
            this.rev = await saveListByAsync(LocalNameEnum.EDITOR, this.drivers, this.rev);
        },
        async add(driver: Omit<EditorDriver, 'id' | 'createTime' | 'updateTime'>) {
            const now = new Date();
            this.drivers.push({
                ...driver,
                id: now.getTime(),
                createTime: now,
                updateTime: now,
            });
            await this._sync();
        },
        async update(id: number, driver: Omit<EditorDriver, 'id' | 'createTime' | 'updateTime'>) {
            const index = this.drivers.findIndex(e => e.id === id);
            if (index === -1) {
                throw new Error("驱动未找到");
            }
            this.drivers[index] = {
                ...this.drivers[index],
                ...driver,
                updateTime: new Date(),
            }
            await this._sync();
        },
        async remove(id: number) {
            const index = this.drivers.findIndex(e => e.id === id);
            if (index === -1) {
                throw new Error("驱动未找到");
            }
            this.drivers.splice(index, 1);
            await this._sync();
            if (this.driverId === id) {
                // 删除的是当前的

            }
        },


        async getNodes(key: string): Promise<Array<TreeNodeData>> {
            const nodes = await this.service.loadToc(key);
            this.itemsMap.set(key, nodes);
            return Promise.resolve(nodes);
        },
        async folders(init: boolean = false): Promise<TreeNodeData[]> {
            if (init) {
                this.itemsMap = new Map<string, Array<TreeNodeData>>();
            }
            if (this.driverId === 0) {
                // 没有选择
                return [];
            }
            let root = this.itemsMap.get("");
            if (!root) {
                root = await this.service.loadToc("");
                this.itemsMap.set("", root);
            }
            return buildTree(this.itemsMap, "")
        },
        setSelectKey(selectKey: string) {
            this.selectKey = selectKey;
        },
        async setEditorDriver(driverId: number) {

            this.driverId = driverId;

            const index = this.drivers.findIndex(e => e.id === driverId);
            if (index === -1) {
                throw new Error("驱动未找到");
            }

            const driver = this.drivers[index];

            setItem<number>(LocalNameEnum.KEY_EDITOR_DRIVER_ID, driver.id);

            if (driver.type === EditorDriverTypeEnum.LOCAL) {
                this.service = new FileArticleServiceImpl(driver);
            } else {
                this.service = new DefaultArticleServiceImpl();
            }
            //初始化
            this.itemsMap = new Map<string, Array<TreeNodeData>>();
            this.itemsMap.set("", await this.service.loadToc(""));
            this.selectKey = '';
        },

        clear() {
            this.driverId = 0;
            setItem<number>(LocalNameEnum.KEY_EDITOR_DRIVER_ID, 0);
            this.service = new DefaultArticleServiceImpl();
            //初始化
            this.itemsMap = new Map<string, Array<TreeNodeData>>();
            this.selectKey = '';
        },


        switchCollapsed(collapsed?: boolean) {
            this.collapsed = typeof collapsed === 'undefined' ? !this.collapsed : collapsed;
        },
        setWidth(width: string) {
            if (width === '0px' && this.collapsed) {
                return;
            }
            this.widthWrap = width;
            setItem<string>(LocalNameEnum.KEY_EDITOR_WIDTH, this.widthWrap);
        }
    }
});

function buildTree(itemMap: Map<string, Array<TreeNodeData>>, pid: string): Array<TreeNodeData> {
    const items = itemMap.get(pid);
    const nodes = new Array<TreeNodeData>();
    if (!items) {
        return nodes;
    }
    _buildTree(items, itemMap, nodes);
    return nodes;
}

function _buildTree(items: Array<TreeNodeData>, itemMap: Map<string, Array<TreeNodeData>>, nodes: Array<TreeNodeData>) {
    items = items.sort((a, b) => (a.key as string).localeCompare(b.key as string));
    for (let item of items) {
        if (!item.isLeaf) {
            const children = itemMap.get(item.key as string);
            const nodeChildren = new Array<TreeNodeData>();
            if (children) {
                _buildTree(children, itemMap, nodeChildren);
                nodes.push({
                    ...item,
                    children: nodeChildren
                });
                continue;
            }
        }
        nodes.push(item);
    }
}
