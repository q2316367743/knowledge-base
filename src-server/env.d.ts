declare module "express-pouchdb" {
  import PouchDB from "pouchdb";
  import { RequestHandler } from "express";
  interface ExpressPouchDBProps {
    /**
     * 要使用的配置文件的路径。
     * @default “./config.Json”
     */
    configPath?: string;
    /**
     * 要使用的日志文件的路径。
     * @default "./log.txt"
     */
    logPath?: string;
    /**
     * true如果所有配置都应该在内存中。
     * @default false
     */
    inMemoryConfig?: boolean;
    /**
     *  确定启用HTTP API express-pouchdb选件的哪些部分。有三个值:
     * 'fullCouchDB': 启用HTTP API的每个部分，这使得express-pouchdb非常接近于完全替代CouchDB。这是默认设置。
     * 'minimumForPouchDB': 仅公开将1-1映射到PouchDB API的HTTP api的部分。这是使PouchDB测试套件运行所需的最低要求，当您只需要一个HTTP API来复制时，这是一个不错的开始。
     * 'custom': 不启用HTTP API的任何部分。您可以使用自己添加零件opts.overrideMode下面讨论。
     */
    mode?: "fullCouchDB" | "minimumForPouchDB" | "custom";
    /**
     * 有时预编程模式不足以满足您的需求，或者您选择了'custom'模式。在这种情况下，您可以将其设置为对象。此对象可以具有以下属性:
     * 'include': 一个javascript数组，它指定要包含在指定的部分之上的部分opts.mode。可选。
     * 'exclude': 一个javascript数组，它指定要从指定的部分中排除的部分opts.mode。可选。
     */
    overrideMode?: {
      include?: string[];
      exclude?: string[];
    };
  }
  export default function (db: PouchDB, opt?: {}): RequestHandler;
}
