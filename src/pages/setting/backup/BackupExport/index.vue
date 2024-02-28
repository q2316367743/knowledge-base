<template>
    <div>
        <a-alert title="数据导出">将插件内数据导出</a-alert>
        <a-button-group type="primary" style="margin: 14px 0;">
            <a-button @click="exportForZone()">
                导出空间信息
            </a-button>
        </a-button-group>
    </div>
</template>
<script lang="ts" setup>
import {getFromOneByAsync, getFromOneWithDefaultByAsync, listByAsync} from "@/utils/utools/DbStorageUtil";
import {ZoneContent} from "@/pages/setting/backup/BackupExport/ZoneContent";
import {ZoneIndex} from "@/pages/setting/backup/BackupExport/ZoneIndex";
import {NoteContent, NoteIndex, NoteRelation} from "@/pages/setting/backup/BackupExport/Note";
import {ZoneBase} from "@/pages/setting/backup/BackupExport/ZoneBase";
import JSZip from "jszip";
import {download} from "@/utils/BrowserUtil";
import {ZoneComment} from "@/pages/setting/backup/BackupExport/ZoneComment";



const ZONE = '/local/zone',
    ZONE_BASE = '/zone/base/',
    ZONE_CONTENT = '/zone/content/',
    ZONE_COMMENT = '/zone/comment/';

async function exportForZone() {
    // 获取全部的空间列表
    const zones = await listByAsync<ZoneIndex>(ZONE);
    const notes = new Array<NoteContent>();
    for (let zone of zones.list) {
        const zoneBase = await getFromOneByAsync<ZoneBase>(ZONE_BASE + zone.id);
        const zoneContent = await getFromOneByAsync<ZoneContent>(ZONE_CONTENT + zone.id);
        const comments = await getFromOneWithDefaultByAsync<Array<ZoneComment>>(ZONE_COMMENT + zone.id, []);

        const tags = zoneBase.record ? zoneBase.record.tags : [];
        if (!zoneContent.record) {
            continue;
        }

        const note: NoteContent = {
            id: zone.id,
            updateTime: new Date(zone.updateTime).getTime(),
            content: zoneContent.record.body + '\n' + tags.map(tag => `#${tag}`).join(" "),
            relationNotes: [],
            top: false,
            tags: tags,
            deleted: false
        };

        const commentNotes = new Array<NoteContent>();

        for (let zoneComment of comments.record) {
            const relation: NoteRelation = {
                noteId: zoneComment.id,
                relationId: zone.id,
                type: 'COMMENT'
            };
            commentNotes.push({
                id: zoneComment.id,
                updateTime: zoneComment.id,
                content: zoneComment.content,
                relationNotes: [relation],
                top: false,
                tags: [],
                deleted: false
            });
            note.relationNotes.push(relation);
        }


        notes.push(note, ...commentNotes);

    }

    // 根据内容生成列表
    const indexes: Array<NoteIndex> = notes.map(e => ({
        id: e.id,
        top: e.top,
        deleted: e.deleted,
        updateTime: e.updateTime
    }));

    // 打包一下
    const zip = new JSZip();
    zip.file("/list/note", JSON.stringify(indexes));
    for (let note of notes) {
        zip.file(`/note/${note.id}`, JSON.stringify(note));
    }

    zip.generateAsync({type: "blob"}).then(blob => download(blob, "notes.zip", "application/zip"))

}
</script>
<style scoped>

</style>
