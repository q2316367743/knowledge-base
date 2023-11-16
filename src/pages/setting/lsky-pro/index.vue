<template>
    <div class="lsky-pro">
        <a-tabs v-model:active-key="activeKey" hide-content>
            <a-tab-pane key="1" title="上传文件"/>
            <a-tab-pane key="2" title="我的图片" :disabled="disabled"/>
            <template #extra>
                <a-button type="text" v-if="disabled" style="margin-right: 7px;" @click="login()">登录</a-button>
                <a-dropdown v-else-if="isLogin">
                    <a-button type="text">
                        <a-avatar :image-url="avatar" :size="32"/>
                        <span style="margin: 0 7px">{{ username }}</span>
                    </a-button>
                    <template #content>
                        <a-doption @click="showProfile()">个人信息</a-doption>
                        <a-doption @click="showToken()">查看token</a-doption>
                        <a-doption @click="clearToken()">清空token</a-doption>
                        <a-doption @click="logout()">注销</a-doption>
                    </template>
                </a-dropdown>
                <a-dropdown v-else style="margin-right: 7px;">
                    <a-button type="text">游客</a-button>
                    <template #content>
                        <a-doption @click="login()">登录</a-doption>
                        <a-doption @click="logout()">注销</a-doption>
                    </template>
                </a-dropdown>
            </template>
        </a-tabs>
        <main class="container">
            <lsky-pro-upload v-if="activeKey === '1'"/>
            <lsky-pro-image v-else-if="activeKey === '2'"/>
        </main>
        <a-modal v-model:visible="auth.visible" title="登录">
            <a-alert>服务器地址必填，其他选项不填写，会自动转为游客</a-alert>
            <a-form :model="auth" layout="vertical">
                <a-form-item label="服务器地址">
                    <a-input v-model="auth.url"/>
                </a-form-item>
                <a-form-item label="邮箱">
                    <a-input v-model="auth.email"/>
                </a-form-item>
                <a-form-item label="密码">
                    <a-input-password v-model="auth.password"/>
                </a-form-item>
                <a-form-item label="token">
                    <a-input-password v-model="auth.token" placeholder="输入后将直接使用此token"/>
                    <template #help>
                        自定义token后，可以不输入邮箱和密码
                    </template>
                </a-form-item>
            </a-form>
            <template #footer>
                <a-button type="primary" @click="submit()">登录</a-button>
            </template>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import {computed, h, ref} from "vue";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import LskyProImage from "@/pages/setting/lsky-pro/components/lsky-pro-image.vue";
import {Descriptions, DescriptionsItem, Modal, Progress} from "@arco-design/web-vue";
import LskyProUpload from "@/pages/setting/lsky-pro/components/lsky-pro-upload.vue";
import {prettyDataUnit} from "@/utils/BrowserUtil";

const activeKey = ref('1');
const auth = ref({
    visible: false,
    url: '',
    email: '',
    password: '',
    token: ''
})

const disabled = computed(() => !useLskyProSettingStore().isAvailable);
const isLogin = computed(() => useLskyProSettingStore().isLogin);
const username = computed(() => useLskyProSettingStore().username);
const avatar = computed(() => useLskyProSettingStore().avatar);


function login() {
    auth.value = {
        ...useLskyProSettingStore().option,
        visible: true,
    };
}

function submit() {
    useLskyProSettingStore().login(auth.value)
        .then(() => {
            MessageUtil.success("登录成功");
            auth.value.visible = false;
        })
        .catch(e => MessageUtil.error("登录失败", e))
}

function logout() {
    MessageBoxUtil.confirm("是否注销登录", "注销登录")
        .then(() => {
            useLskyProSettingStore().logout()
                .then(() => MessageUtil.success("注销成功"))
                .catch(e => MessageUtil.error("注销失败", e));
        })
}

function clearToken() {
    MessageBoxUtil.confirm("是否清空全部token，清空后将自动退出登录状态", "清空全部token")
        .then(() => {
            useLskyProSettingStore().clearToken()
                .then(() => MessageUtil.success("清空成功"))
                .catch(e => MessageUtil.error("清空失败", e));
        })
}

function showToken() {
    MessageBoxUtil.alert(useLskyProSettingStore().option.token, "查看token", {
        confirmButtonText: "复制",
        cancelButtonText: "关闭"
    }).then(() => {
        utools.copyText(useLskyProSettingStore().option.token);
        MessageUtil.success("已成功复制到剪切板");
    })
}

function showProfile() {
    useLskyProSettingStore().getProfile()
        .then(profile => {
            Modal.open({
                title: "个人信息",
                draggable: true,
                content: () => h(Descriptions, {
                    bordered: true,
                    column: 1
                }, {
                    default: () => ([
                        h(DescriptionsItem, {
                            label: "用户名"
                        }, {default: () => profile.name}),
                        h(DescriptionsItem, {
                            label: "邮箱地址"
                        }, {default: () => profile.email}),
                        h(DescriptionsItem, {
                            label: "容量"
                        }, {
                            default: () => ([
                                h(Progress, {
                                    percent: profile.used_capacity / profile.capacity
                                }, {
                                    text: () => {
                                        return prettyDataUnit(profile.used_capacity * 1024) + "/" +
                                            prettyDataUnit(profile.capacity * 1024)
                                    }
                                })
                            ])
                        }),
                        h(DescriptionsItem, {
                            label: "个人主页地址"
                        }, {default: () => profile.url}),
                        h(DescriptionsItem, {
                            label: "图片数量"
                        }, {default: () => profile.image_num}),
                        h(DescriptionsItem, {
                            label: "相册数量"
                        }, {default: () => profile.album_num}),
                        h(DescriptionsItem, {
                            label: "注册IP"
                        }, {default: () => profile.registered_ip})
                    ])
                })
            })
        });
}
</script>
<style scoped lang="less">
.lsky-pro {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .container {
        position: absolute;
        top: 46px;
        left: 7px;
        right: 7px;
        bottom: 7px;
    }
}
</style>
