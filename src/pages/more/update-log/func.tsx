import {TxcUpdateLogData} from "@/pages/more/update-log/types";
import {
    Avatar,
    AvatarGroup, Button,
    Divider,
    Link,
    Space,
    Tag,
    TypographyParagraph,
    TypographyTitle
} from "@arco-design/web-vue";
import Constant from "@/global/Constant";
import {IconClockCircle, IconShareExternal, IconTag} from "@arco-design/web-vue/es/icon";


export const toUpdateLog = () => utools.shellOpenExternal(`https://txc.qq.com/products/${Constant.txcId}/change-log`)
export const jumpToInfo = (id: string) => utools.shellOpenExternal(`https://txc.qq.com/products/${Constant.txcId}/post/${id}/`)
export const jumpToUser = (id: number) => utools.shellOpenExternal(`https://txc.qq.com/products/${Constant.txcId}/profile/${id}/`)


export function renderContent(data: TxcUpdateLogData, name:string) {

    const json = JSON.parse(data.content);
    const detailsStr = json['content'] as string;
    const details = JSON.parse(detailsStr) as Array<{ detail: string, title: string }>;
    const thankPostIdList = json['thank_post_id_list'] as Array<string>;
    return <>
        <TypographyTitle heading={3}>
            <span>{name}</span>
            <Tag color={'arcoblue'} style={{marginLeft: '14px'}}>
                {{
                    icon: () => <IconTag />,
                    default: () => <span>{json['version']}</span>
                }}
            </Tag>
        </TypographyTitle>
        <TypographyParagraph  style="justify-content: space-between;display: flex;">
            <Space>
                <Avatar size={24}>
                    <img src={data.avatar_url} alt={data.nick_name}/>
                </Avatar>
                <Link onClick={() => jumpToUser(data.user_id)}>{data.nick_name}</Link>
                <span>发布于</span>
                <Tag color='orange'>
                    {{
                        icon: () => <IconClockCircle />,
                        default: () => <span>{data.created_at}</span>
                    }}
                </Tag>
            </Space>
            <Button shape={'round'} onClick={() => jumpToInfo(data.id)}>
                {{
                    icon: () => <IconShareExternal />,
                    default: () => <span>详情&讨论</span>
                }}
            </Button>
        </TypographyParagraph>
        <TypographyParagraph>
            {details.map(item => <>
                <h1 innerHTML={item.title}></h1>
                <p innerHTML={item.detail}></p>
            </>)}
            {thankPostIdList.length > 0 && <>
                <Divider />
                <div>
                    <h3>感谢一下同学反馈</h3>
                    <AvatarGroup>{thankPostIdList.map(e => JSON.parse(e)).map(e => <Avatar>
                        <img alt={e['nickName']} src={e['avatarUrl']} onClick={() => jumpToUser(e['userId'])}
                             style={{cursor: 'pointer'}}/>
                    </Avatar>)}</AvatarGroup>
                </div>
            </>}
        </TypographyParagraph>
    </>
}
