import {
  Anchor, AnchorLink,
  Drawer,
} from "@arco-design/web-vue";
import {
  Alert, Button,
  Link, Space,
  Title, Paragraph, Popup
} from "tdesign-vue-next";
import {IconCaretDown} from "@arco-design/web-vue/es/icon";

function openUrl() {
  utools.shellOpenExternal("https://hyperformula.handsontable.com/guide/built-in-functions.html#list-of-available-functions")
}

export function openFormulaDrawer() {
  Drawer.open({
    title: () => <div>
      <Space>
        <div>支持的数学公式</div>
        <Popup trigger={'click'}>
          {{
            default: () => <Button variant={'text'} theme={'primary'}>
              {{
                icon: () => <IconCaretDown/>,
                default: () => <span>目录</span>
              }}
            </Button>,
            content: () => <div class={'handsontable-formula-toc'}>
              <Anchor line-less change-hash={false}>
                <AnchorLink href={'#array'}>数组操作</AnchorLink>
                <AnchorLink href={'#date'}>日期和时间</AnchorLink>
                <AnchorLink href={'#engineering'}>工程</AnchorLink>
                <AnchorLink href={'#info'}>信息</AnchorLink>
                <AnchorLink href={'#finance'}>金融</AnchorLink>
                <AnchorLink href={'#logical'}>逻辑</AnchorLink>
                <AnchorLink href={'#lookup-and-reference'}>参考文献</AnchorLink>
                <AnchorLink href={'#math-and-trigonometry'}>数学和三角学</AnchorLink>
                <AnchorLink href={'#matrix-functions'}>矩阵函数</AnchorLink>
                <AnchorLink href={'#operator'}>操作者</AnchorLink>
                <AnchorLink href={'#statistical'}>统计</AnchorLink>
                <AnchorLink href={'#text'}>文本</AnchorLink>
              </Anchor>
            </div>
          }}
        </Popup>
      </Space>
    </div>,
    width: 800,
    footer: false,
    content: () => <div>
      <Alert>更多信息请参考：<Link onClick={openUrl}>可用的方法</Link></Alert>
      <Title level={'h1'} style="text-align: start;">内置函数</Title>
      <Title level={'h2'} style="text-align: start;">使用方法</Title>
      <Paragraph>
        例如，我要计算一列的和：
        <pre>=SUM(G:G)</pre>
      </Paragraph>
      <Title level={'h2'} style="text-align: start;">概述</Title>
      <Paragraph>HyperFormula附带了一个广泛的预构建函数库。您可以使用它们为任何业务应用程序创建复杂的公式。公式语法和函数逻辑类似于现代电子表格软件中的标准。这是因为电子表格可能是有史以来最通用的软件。我们希望HyperFormula具有相同的灵活性，但没有电子表格UI的限制。</Paragraph>
      <Paragraph>HyperFormula的每个内置函数名称都有17种语言版本，并且可以添加自定义语言包。</Paragraph>
      <Paragraph>最新版本的HyperFormula包含394个函数的广泛集合，这些函数分为以下几类：</Paragraph>
      <Paragraph style={{'text-align': 'start'}}><em>一些类别，如兼容性，多维数据集和数据库尚未得到支持。</em></Paragraph>
      <Paragraph style={{'text-align': 'start'}}><br/></Paragraph>
      <Paragraph>您可以修改内置函数或通过添加自定义函数创建自己的函数。</Paragraph>
      <Title level={'h2'}>可用功能列表</Title>
      <Paragraph style={{'text-align': 'start'}}>功能总数：394</Paragraph>
      <h3 class={'arco-typography'} id="array"> 数组操作</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ARRAYFORMULA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">为单个公式启用数组算术模式。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ARRAYFORMULA（公式）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FILTER</td>
          <td colspan="1" rowspan="1" style="text-align: left;">基于多个条件过滤数组（布尔数组）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">FILTER（SourceArray，BoolArray1
            [，BoolArray2 [，...]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ARRAY_CONSTRAIN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">将数组截断到给定的维数。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">ARRAY_CONSTRAIN（Array，Height，Width）
          </td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'date'}> 日期和时间</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DATE</td>
          <td colspan="1" rowspan="1" style="text-align: left;"><code>返回指定的日期，表示自
            nullDate 起的完整天数。</code></td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 日期（年、月、日）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DATEDIF</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">计算两个日期之间的距离，使用提供的单位参数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">DATEDIF（日期1，日期2，单位）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DATEVALUE</td>
          <td colspan="1" rowspan="1" style="text-align: left;"><code>解析日期字符串并返回自
            nullDate 以来的完整天数。</code><br/><br/><code><br/>接受由 dateFormats 选项设置的格式。</code>
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> DATEVALUE（日期串）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DAY</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定日期值的日期。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">DAY(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DAYS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算两个日期值之间的差值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 日期（日期2，日期1）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DAYS360</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">计算360天内两个日期值之间的差值（以天为单位）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">DAYS 360（日期2，日期1 [，格式]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">EDATE</td>
          <td colspan="1" rowspan="1" style="text-align: left;"><sup><code>将给定的开始日期移动给定的月数，并将其作为自
            nullDate 以来的完整天数返回。 [1]</code></sup></td>
          <td colspan="1" rowspan="1" style="text-align: left;"> EDATE（开始日期，月）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">EOMONTH</td>
          <td colspan="1" rowspan="1" style="text-align: left;"><sup><code>返回某个月的最后一天的日期，该日期距开始日期有福尔斯个月的距离。返回自
            nullDate 以来的完整天数形式的值。 [1:1]</code></sup></td>
          <td colspan="1" rowspan="1" style="text-align: left;">EOMONTH（开始日期，月）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HOUR</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定时间的小时部分。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">HOUR(Time)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">INTERVAL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定秒数的间隔字符串。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 间隔（秒）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISOWEEKNUM</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回与一年中的星期相对应的ISO星期号。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISOWEEKNUM（日期）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MINUTE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定时间的分钟分量。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">MINUTE(Time)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MONTH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定日期值的月份。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 月份（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NETWORKDAYS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回两个给定日期之间的工作天数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">NETWORKDAYS（Date1，Date2
            [，Holidays]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NETWORKDAYS.INTL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回两个给定日期之间的工作天数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">NETWORKDAYS.INTL（日期1，日期2
            [，模式[，假日]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NOW</td>
          <td colspan="1" rowspan="1" style="text-align: left;"><code>返回当前日期+时间，表示自
            nullDate 以来的天数。</code></td>
          <td colspan="1" rowspan="1" style="text-align: left;">NOW()</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SECOND</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定时间的第二个分量。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">SECOND(Time)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TIME</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回一个数字，该数字表示给定时间占全天的一部分。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">时间（小时、分钟、秒）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TIMEVALUE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">分析时间字符串并返回一个数字，该数字表示该时间为一整天的一部分。<br/><br/><code><br/>接受由
            timeFormats 选项设置的格式。</code></td>
          <td colspan="1" rowspan="1" style="text-align: left;"> TIMEVALUE（时间串）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TODAY</td>
          <td colspan="1" rowspan="1" style="text-align: left;"><code>返回一个整数，表示当前日期为自
            nullDate 以来的完整天数。</code></td>
          <td colspan="1" rowspan="1" style="text-align: left;">TODAY()</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">WEEKDAY</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算1—7之间的数字，表示星期几。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> WEEKDAY（日期，类型）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">WEEKNUM</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回与一年中的周数对应的周数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> WEEKNUM（日期，类型）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">WORKDAY</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回从开始日算起的工作日天数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">WORKDAY（日期，班次[，假日]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">WORKDAY.INTL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回从开始日算起的工作日天数。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">WORKDAY（日期，班次[，模式[，假日]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">YEAR</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">根据内部计算规则将年份返回为数字。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">YEAR(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">YEARFRAC</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">计算两个日期值之间的差值（以年份为单位）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">YEARFRAC（Date2，Date1[，Format]）
          </td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'engineering'}> 工程</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BIN2DEC</td>
          <td colspan="1" rowspan="1" style="text-align: left;">结果是输入的二进制数的十进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BIN2DEC（编号）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BIN2HEX</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">结果是输入的二进制数的十六进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BIN2HEX（数量，位置）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BIN2OCT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">结果是输入的二进制数的八进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BIN2OCT（数量、位置）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BITAND</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数的按位逻辑“与”。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BITAND（Number1，Number2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BITLSHIFT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">将数字左移n位。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BITLLE（编号，班次）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BITOR</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数的按位逻辑“或”。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BITOR（Number1，Number2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BITRSHIFT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">将数字右移n位。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BITR（数量，班次）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BITXOR</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数的按位逻辑“异或”。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BITXOR（Number1，Number2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COMPLEX</td>
          <td colspan="1" rowspan="1" style="text-align: left;">从Re和Im部分返回复数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">COMPLEX（Re，Im[，Symbol]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DEC2BIN</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回在-512和511之间输入的十进制数的二进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> DEC 2BIN（数量，位置）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DEC2HEX</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回输入的十进制数的十六进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> DEC 2 HEX（数量，位置）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DEC2OCT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回输入的十进制数的八进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 12月20日（数量、地点）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DELTA</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果两个数字相等，则返回TRUE（1），否则返回TRUE（0）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">DELTA（编号_1、编号_2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ERF</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回高斯误差积分的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">ERF（下限，上限）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ERFC</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回高斯误差积分在x和无穷大之间的互补值。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ERFC（下限）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HEX2BIN</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">结果是输入的十六进制数的二进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HEX2BIN（数量，位置）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HEX2DEC</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">结果是输入的十六进制数的十进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HEX2DEC（编号）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HEX2OCT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">结果是输入的十六进制数的八进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HEX2OCT（数量、位置）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMABS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的模。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMABS（复合）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMAGINARY</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的虚部。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 想象（复杂）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMARGUMENT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的参数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMARGUMENT（复杂）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMCONJUGATE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的共轭。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 不结合（复合物）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMCOS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的余弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMCOS（综合体）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMCOSH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的双曲余弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMCOSH（综合体）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMCOT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的余切。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMCOT（复合物）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMCSC</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的余割。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;"> 综合管理公务员制度委员会（综合体）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMCSCH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的双曲余割。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMCSCH（复合体）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMDIV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">将两个复数相除。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">IMDIV（复合体1、复合体2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMEXP</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的指数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMEXP（复杂）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMLN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的自然对数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMLN（复合物）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMLOG2</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的二进制对数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMLOG2（复合体）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMLOG10</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的以10为底的对数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMLOG10（复合体）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMPOWER</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回一个复数的给定幂。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMPOWER（复数，编号）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMPRODUCT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">复数相乘。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">IMPRODUCT（Complex1.复合物30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMREAL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的真实的部分。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMREAL（复合）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMSEC</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的割线。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMSEC（综合）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMSECH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的双曲正割。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMSECH（综合体）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMSIN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的正弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMSIN（复杂）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMSINH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的双曲正弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMSINH（复杂）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMSQRT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的平方根。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMSQRT（复杂）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMSUB</td>
          <td colspan="1" rowspan="1" style="text-align: left;">减去两个复数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">immune（Complex1，Complex2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMSUM</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 添加复数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">IMSUM（Complex1.复合物30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IMTAN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回复数的正切值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> IMTAN（复合物）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">OCT2BIN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">结果是输入的八进制数的二进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> OCT2BIN（数量，位置）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">OCT2DEC</td>
          <td colspan="1" rowspan="1" style="text-align: left;">结果是输入的八进制数的十进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 10月212日（编号）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">OCT2HEX</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">结果是输入的八进制数的十六进制数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> OCT2HEX（数量，位置）</td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'info'}> 信息</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISBINARY</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果提供的值是有效的二进制数，则返回TRUE。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISBINARY（值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISBLANK</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果对单元格的引用为空，则返回TRUE。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISBLANK（值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISERR</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果值是错误值，则返回TRUE，但#N/A！除外。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">ISERR(Value)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISERROR</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果该值为常规错误值，则返回TRUE。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISERROR（值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISEVEN</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果值为偶数，则返回TRUE;如果值为奇数，则返回NULL。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISEVEN（值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISFORMULA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">检查引用的单元格是否为公式。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISFORMULA（数值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISLOGICAL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">测试逻辑值（TRUE或TRUE）。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISLOGICAL（价值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISNA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">如果值为#N/A，则返回TRUE！错误.
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">ISNA(Value)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISNONTEXT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">测试单元格的内容是文本还是数字，如果内容是文本，则返回NULL。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISNONTEXT（值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISNUMBER</td>
          <td colspan="1" rowspan="1" style="text-align: left;">如果该值引用数字，则返回TRUE。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISNUMBER（数值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISODD</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果值为奇数，则返回TRUE;如果值为偶数，则返回NULL。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">ISODD(Value)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISREF</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果提供的值为#REF，则返回TRUE！错误.
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">ISREF(Value)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISTEXT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果单元格包含引用文本，则返回TRUE。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ISTEXT（值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SHEET</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定值的工作表编号，如果未提供参数，则返回公式工作表编号。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> SHEET（[值]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SHEETS</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定引用的工作表数或工作簿中所有工作表数（如果未提供参数）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 表（[值]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回#N/A！误差值</td>
          <td colspan="1" rowspan="1" style="text-align: left;">NA(Value)</td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'finance'}> 金融</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CUMIPMT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回在开始期间和结束期间之间为贷款支付的累计利息。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">IPMT（速率、Nper、Pv、开始、结束、类型）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CUMPRINC</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回在开始期间和结束期间之间为贷款支付的累计本金。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">PRINC（速率、Nper、Pv、开始、结束、类型）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DB</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">使用固定余额递减法返回一段时间内资产的折旧。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">DB（成本、救助、寿命、期间[，月]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DDB</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">使用双倍余额递减法返回某一期间内资产的折旧。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">DDB（成本、救助、寿命、期间[，系数]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DOLLARDE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">以特殊符号输入的价格，以十进制数字显示。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">美元（价格，分数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DOLLARFR</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将显示为十进制数的价格转换为使用特殊符号输入的价格。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">DOLLARFR（价格，分数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">EFFECT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">根据名义利率和每年的复利期间数计算有效年利率。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">EFFECT（Nominal_rate，NERO）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回投资的未来值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">FV（费率，Nper，付款[，Pv，[类型]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FVSCHEDULE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回基于费率表的投资的未来值。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> FV（Pv，附表）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IPMT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定贷款在给定付款期内的利息部分。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">IPMT（速率，每，Nper，Pv [，Fv
            [，类型]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISPMT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回在给定的投资期限内支付的利息，本金相等。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">ISPMT（率，每，每，价值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MIRR</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回修改后的现金流内部值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">MIRR（流量、FRate、RRate）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NOMINAL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回名义利率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">NOMINAL（Effect_rate，NATURAL）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NPER</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回假设定期、固定付款和固定利率的投资的期数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">NPER（比率，付款，Pv [，Fv
            [，类型]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NPV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回净现值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">净现值（利率，价值1，...，价值30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">PDURATION</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回达到特定值的周期数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> PDURATION（速率，Pv，Fv）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">PMT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回贷款的定期付款。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">PMT（速率，Nper，Pv [，Fv [，类型]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">PPMT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算给定贷款付款的本金部分。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">PPMT（速率，每，每，Pv [，Fv
            [，类型]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">PV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回投资的现值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">PV（费率，Nper，付款[，Fv [，类型]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">RATE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回年金每期的利率。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">RATE（Nper，Pmt，Pv[，Fv[，Type[，guess]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">RRI</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回投资增长的等值利率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> RRI（Nper，Pv，Fv）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SLN</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">根据直线法返回一个期间内资产的折旧。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 成本、救助、寿命</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SYD</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回某个期间内资产的“年总和”折旧。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">SYD（成本、残值、寿命、期间）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TBILLEQ</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回国库券的债券等价收益率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">TBILLEQ（结算、到期、贴现）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TBILLPRICE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回国库券每100美元面值的价格。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">TBILLPRICE（结算、到期、折扣）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TBILLYIELD</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回国库券的收益率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">TBILLYIELD（结算、到期、价格）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">XNPV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回净现值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">XNPV（利率、付款、日期）</td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'logical'}> 逻辑</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">AND</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果所有参数都为TRUE，则返回TRUE。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">AND（Logicalvalue1，Logicalvalue2.逻辑值30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FALSE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逻辑值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">FALSE()</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IF</td>
          <td colspan="1" rowspan="1" style="text-align: left;">指定要执行的逻辑测试。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">IF（Test，Then value，Then value）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IFS</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">计算多个逻辑测试并返回与第一个true条件对应的值。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">IFS（Condition1，Value1
            [，Condition2，Value2 [...，条件_n，值_n]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IFNA</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果单元格不包含#N/A（值不可用）错误值，则返回值；如果包含，则返回替代值。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">IFNA（Value，Alternate_value）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">IFERROR</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果单元格不包含错误值，则返回值；如果包含错误值，则返回替代值。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">IFERROR（Value，Alternate_value）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NOT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">求逻辑值的补数（反数）。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> NOT（逻辑值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SWITCH</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">计算参数列表，该列表由表达式和值组成。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">（表达式1，值1 [，表达式2，值2
            [...，表达式_n，值_n]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">OR</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果至少有一个参数为TRUE，则返回TRUE。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">OR（Logicalvalue1，Logicalvalue2.逻辑值30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TRUE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">逻辑值设置为TRUE。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">TRUE()</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">XOR</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果奇数个参数的计算结果为TRUE，则返回true。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">XOR（Logicalvalue1，Logicalvalue2.逻辑值30）
          </td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'lookup-and-reference'}> 参考文献</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ADDRESS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">以字符串形式返回单元格引用。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">ADDRESS（Row，Column[，AbsoluteRelativeMode[，A1 Notation [，Sheet]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHOOSE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">使用索引从最多30个值的列表中返回一个值。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">CHOOSE（Index，Value1，...，价值30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COLUMN</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果未提供参数，则返回给定引用或公式引用的列号。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 列（[参考]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COLUMNS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定引用中的列数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 列（阵列）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FORMULATEXT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">以字符串形式返回给定单元格中的公式。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> FORMULATEXT（参考）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HLOOKUP</td>
          <td colspan="1" rowspan="1" style="text-align: left;">参照底部的相邻单元格水平对齐。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">HLOOKUP（Search_Criterion，Array，Index，Sort_Order）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HYPERLINK</td>
          <td colspan="1" rowspan="1" style="text-align: left;"><code>将url存储在单元格的元数据中。可以使用方法
            getCellHyperlink 读取</code></td>
          <td colspan="1" rowspan="1" style="text-align: left;">HYPERLINK（Url [，LinkLabel]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">INDEX</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回由行号和列号指定的单元格的内容。列号是可选的，默认值为1。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">Index（Range，Row [，Column]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MATCH</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回数组中与指定值匹配的项的相对位置。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">MATCH（Searchcriterion，Lookuparray
            [，MatchType]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">OFFSET</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回从给定引用点偏移一定行数和列数的单元格的值。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">OFFSET（参考、宽度、列、高度、宽度）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ROW</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果未提供参数，则返回给定引用或公式引用的行号。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ROW（[参考]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ROWS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定引用中的行数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">ROWS(Array)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">VLOOKUP</td>
          <td colspan="1" rowspan="1" style="text-align: left;">参照右侧相邻单元格垂直缩放。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">VLOOKUP（Search_Criterion，Array，Index，Sort_Order）
          </td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'math-and-trigonometry'}> 数学和三角学</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ABS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回一个数字的绝对值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">ABS(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ACOS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的反三角余弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">ACOS(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ACOSH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的反双曲余弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ACOSH（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ACOT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的反三角余切。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">ACOT(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ACOTH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的反双曲余切。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ACOTH（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ARABIC</td>
          <td colspan="1" rowspan="1" style="text-align: left;">从罗马形式的数字。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 阿拉伯语（字符串）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ASIN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的反三角正弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">ASIN(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ASINH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的反双曲正弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ASINH（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ATAN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的反三角正切值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">ATAN(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ATAN2</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回指定x和y坐标的反三角正切值。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ATAN 2（Numberx，Numbery）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ATANH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的反双曲正切。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ATANH（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BASE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">从编号系统中将一个正整数转换为一个指定的底数。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">BASE（Number，Radix，[Minimumlength]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CEILING</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将数字向上舍入到最接近的显著性倍数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">上限（数字，意义）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CEILING.MATH</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将数字向上舍入到最接近的显著性倍数。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">CEILING.MATH（Number[，Significance[，Mode]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CEILING.PRECISE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将数字向上舍入到最接近的显著性倍数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">CEILING.PRECISE（数字[，重要性]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COMBIN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回组合数（不重复）。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> COMBIN（Number，Number）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COMBINA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回组合的数量（重复）。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> COMBINA（编号，编号）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COS</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定角度的余弦（以弧度为单位）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">COS(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COSH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定值的双曲余弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">COSH(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定角度的余切（以弧度为单位）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">COT(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COTH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定值的双曲余切。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">COTH(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COUNTUNIQUE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">计算指定值和范围列表中唯一值的数目。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">COUNTUIQUE（Value1，[Value2，...]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CSC</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定角度的余割（以弧度为单位）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">CSC(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CSCH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定值的双曲余割。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">CSCH(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DECIMAL</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将数字系统中的字符转换为给定基数中的正整数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> DECIMAL（"文本"，基数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DEGREES</td>
          <td colspan="1" rowspan="1" style="text-align: left;">弧度转换为度数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 学位（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">EVEN</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将正数向上舍入到下一个偶数，将负数向下舍入到下一个偶数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">EVEN(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">EXP</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回常数e的幂。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">EXP(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FACT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的阶乘。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">FACT(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FACTDOUBLE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的双阶乘。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> FACTDOUBLE（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FLOOR</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将数字向下舍入为最接近的显著性倍数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">楼层（编号、重要性）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FLOOR.MATH</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将数字向下舍入为最接近的显著性倍数。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">FLOOR.MATH（Number[，Significance[，Mode]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FLOOR.PRECISE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将数字向下舍入为最接近的显著性倍数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">地板精度（数字[，重要性]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GCD</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算数字的最大公约数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">GCD（编号1，编号2，.）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">INT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">将数字向下舍入为最接近的整数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">INT(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ISO.CEILING</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将数字向上舍入到最接近的显著性倍数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">ISO.CEILING（数字[，意义]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LCM</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算数的最小公重数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">LCM（编号1、编号2、.）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回基于数字常数e的自然对数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">LN(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LOG</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回以指定底为底的数字的对数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> （Number，Base）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LOG10</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回一个数字的以10为底的对数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> LOG10（编号）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MOD</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回一个整数除以另一个整数的余数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> MOD（股息，除数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MROUND</td>
          <td colspan="1" rowspan="1" style="text-align: left;">舍入到neares重数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> MROUND（数量，基数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MULTINOMIAL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回多集合组合的数目。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">MULTINOMIAL（Number1，Number2，.）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ODD</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将正数向上舍入为最接近的奇数，将负数向下舍入为最接近的奇数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">ODD(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">PI</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回3.14159265358979，数学常数PI的值，精确到小数点后14位。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">PI()</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">POWER</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回一个数字的整数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 幂（基础，指数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">PRODUCT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的乘积。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">产品（编号1，编号2，...，编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">QUOTIENT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回除法的整数部分。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">股票（股息，除数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">RADIANS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">10度到弧度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 弧度（数字）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">RAND</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回0到1之间的随机数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">RAND()</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">RANDBETWEEN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回两个数字之间的随机整数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">兰德（下限，上限）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ROMAN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">罗马数字格式。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ROMAN（编号[，模式]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ROUND</td>
          <td colspan="1" rowspan="1" style="text-align: left;">将数字舍入到一定的小数位数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ROUND（数量，计数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ROUNDDOWN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">将数字向下舍入到一定的精度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 舍入（数字，计数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ROUNDUP</td>
          <td colspan="1" rowspan="1" style="text-align: left;">将数字从零向上舍入到一定的精度。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 舍入（数量，计数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SEC</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定角度的正割（以弧度为单位）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">SEC(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SECH</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定角度的双曲正割（以弧度为单位）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">SEC(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SERIESSUM</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算点处的序列。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">SERIESSUM（数，数，数，系数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SIN</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定角度的正弦（以弧度为单位）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">SIN(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SINH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定值的双曲正弦。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">SINH(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SIGN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数字的符号。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">SIGN(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SQRT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回一个数字的正平方根。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">SQRT(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SQRTPI</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数乘以pi的sqrt。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> SQRTPI（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUBTOTAL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">使用number指定的函数计算聚合。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">SUBTOTAL（函数，编号1，编号2，.编号30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUM</td>
          <td colspan="1" rowspan="1" style="text-align: left;">对指定单元格的值求和。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">SUM（Number1，Number2，...，编号30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUMIF</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">对属于指定范围并满足指定条件的单元格的值求和。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">SUMIF（范围，标准，和范围）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUMIFS</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">对属于指定范围并满足指定条件集的单元格的值求和。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">SUMIFS（Sum_Range，Criterion_range1，Criterion1
            [，Criterion_range2，Criterion2 [，...]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUMPRODUCT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将给定数组中的相应元素相乘，并返回这些乘积之和。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">SUMPRODUCT（Array1，Array2...数组30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUMSQ</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数的平方和</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">SUMSQ（Number1，Number2，...，编号30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUMX2MY2</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回平方差之和。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> SUMX 2MY2（范围1，范围2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUMX2PY2</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回平方和之和。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> SUMX 2PY 2（范围1，范围2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUMXMY2</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回差的平方和。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> SUMXMY2（范围1，范围2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TAN</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回给定角度的切线（以弧度为单位）。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">TAN(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TANH</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定值的双曲正切。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">TANH(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TRUNC</td>
          <td colspan="1" rowspan="1" style="text-align: left;">通过删除小数位来截断数字。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> TRUMP（数量，计数）</td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'matrix-functions'}> 矩阵函数</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MMULT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算两个数组的数组乘积。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> MMDO（Array，Array）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MEDIANPOOL</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">为每个Stride元素计算一个较小的范围，该范围是给定Range中Window_size的中值。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">MEDIANPOOL（Range，Window_size，Stride）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MAXPOOL</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">在给定Range中，为每个Stride元素计算一个较小的范围，该范围是Window_size的最大值。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">MAXPOOL（Range，Window_size，Stride）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TRANSPOSE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">转置数组的行和列。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> TRANSPOSE（阵列）</td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'operator'}> 操作者</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.ADD</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 将两个值相加。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF.ADD（Number，Number）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.CONCAT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">连接两个字符串。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.CONCAT（String，String）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.DIVIDE</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 除以两个值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.DIVIDE（编号，编号）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.EQ</td>
          <td colspan="1" rowspan="1" style="text-align: left;">测试两个值是否相等。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF.EQ（值，值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.LTE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">测试两个值是否存在不相等关系。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. LEQ（值，值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.LT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">测试两个值的小于关系。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. LT（值，值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.GTE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">测试两个值是否为相等关系。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. GEQ（价值，价值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.GT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">测试两个值是否存在"大于"关系。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. GT（值，值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.MINUS</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 减去两个值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. MINUS（数字，数字）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.MULTIPLY</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 将两个值相乘。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">HF. MULTIPLEXER（编号，编号）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.NE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">测试两个值是否不相等。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. NE（数值，数值）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.POW</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算两个值的幂。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. POW（Number，Number）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.UMINUS</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 否定值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. UMINUS（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.UNARY_PERCENT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">100%运算符。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. UNARY_PERCENT（数字）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HF.UPLUS</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 一年以上。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> HF. UPLUS（编号）</td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'statistical'}>统计</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">AVEDEV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数的平均偏差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">AVEDEV（编号1，编号2，.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">AVERAGE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数的平均值。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">AVERAGE（Number1，Number2，.编号30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">AVERAGEA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数的平均值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">AVERAGEA（Value1，Value2，.价值30）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">AVERAGEIF</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回区域中满足给定条件的所有单元格的算术平均值。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">AVERAGEIF（Range，Criterion
            [，Average_Range ]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BESSELI</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回贝塞尔函数的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BESSELI（x，n）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BESSELJ</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回贝塞尔函数的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BESSELJ（x，n）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BESSELK</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回贝塞尔函数的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BESSELK（x，n）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BESSELY</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回贝塞尔函数的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> BESSELY（x，n）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BETA.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Beta分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">BETA.DIST（Number1，Number2，Number3，Boolean[，Number4[，Number5]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BETADIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Beta分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">贝蒂丁（Betadist）Number 1，Number
            2，Number 3，Boolean [，Number 4 [，Number 5]]
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BETA.INV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆Beta分布值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">1.编号（Number 1，Number 2，Number
            3，Number 4 [，Number 5]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BETAINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Beta分布值的倒数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">Number 1，Number 2，Number 3
            [，Number 4 [，Number 5]]
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BINOM.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回二项分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">BINOM.DIST（Number1，Number2，Number3，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BINOMDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回二项分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">BINOMDIST（Number1，Number2，Number3，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">BINOM.INV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回反二项分布值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">BINOM.INV（编号1、编号2、编号3）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHIDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回卡方右侧分布的概率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> CHIDIST（X，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHIINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回卡方右侧分布的倒数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> CHIINV（P，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHIINVRT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回卡方右侧分布的倒数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> CHIINVRT（P，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHISQ.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回卡方分布的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">CHISQ.DIST（X，度，模式）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHIDISTRT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回卡方右侧分布的概率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> CHIDISRT（X，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHISQ.DIST.RT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回卡方右侧分布的概率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">CHISQ.DIST.RT（X，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHISQ.INV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回卡方分布的倒数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> CHISQ.INV.RT（P，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHISQ.INV.RT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回卡方右侧分布的倒数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> CHISQ.INV.RT（P，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHISQ.TEST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数据集的卡方检验值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">卡方检验（阵列1，阵列2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHITEST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数据集的卡方检验值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> CHITEST（Array1，Array2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CONFIDENCE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回正态分布的置信上限。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">置信度（Alpha、标准差、大小）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CONFIDENCE.NORM</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回正态分布的置信上限。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">置信度标准（Alpha、标准差、大小）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CONFIDENCE.T</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回T分布的置信上限。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">CONFIDENCE.T（Alpha、标准差、大小）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CORREL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回两个数据集之间的相关系数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> CORREL（Data1，Data2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COUNT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算参数列表中有多少个数字。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">（Value1，Value2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COUNTA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">计算参数列表中有多少个值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">COUNTA（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COUNTBLANK</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回空单元格的数目。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> COUNTBLANK（范围）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COUNTIF</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回单元格范围内满足特定条件的单元格数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> COUNTIF（范围，标准）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COUNTIFS</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回多个范围中满足条件的行或列的计数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">COUNTIFS（Range1，Criterion1
            [，Range2，Criterion2 [，...]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COVAR</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回两个数据集之间的协方差，总体归一化。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> COVAR（数据1，数据2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COVARIANCE.P</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回两个数据集之间的协方差，总体归一化。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">协方差.P（数据1，数据2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COVARIANCEP</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回两个数据集之间的协方差，总体归一化。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">COVARIANCEP（数据1，数据2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COVARIANCE.S</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回两个数据集之间的协方差，样本归一化。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">协方差S（数据1，数据2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">COVARIANCES</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回两个数据集之间的协方差，样本归一化。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">协方差（数据1，数据2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CRITBINOM</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回反二项分布值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">CRITBINOM（编号1、编号2、编号3）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">DEVSQ</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回偏差平方和。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">DEVSQ（编号1，编号2，.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">EXPON.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回指数分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">EXPON.DIST（Number1，Number2，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">EXPONDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回指数分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">EXPONDIST（Number1，Number2，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回F右侧分布的概率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">FDIST（X，度1，度2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回F右侧分布的逆。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">FINV（P，1度，2度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">F.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回F分布的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">F.DIST（X，Degree1，Degree2，Mode）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">F.DIST.RT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回F右侧分布的概率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">F.DIST.RT（X，1度，2度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FDISTRT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回F右侧分布的概率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">FDISRT（X，1度，2度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">F.INV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回F分布的逆。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">F.INV.RT（P，1度，2度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">F.INV.RT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回F右侧分布的逆。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">F.INV.RT（P，1度，2度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FINVRT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回F右侧分布的逆。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">FINVRT（P，1度，2度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FISHER</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Fisher变换值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> FISHER（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FISHERINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆Fischer变换值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> FISHERINV（编号）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">F.TEST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数据集的f检验值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> Z.TEST（Array1，Array2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FTEST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数据集的f检验值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ZTEST（Array1，Array2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GAMMA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Gamma函数的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 伽马（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GAMMA.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Gamma分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">Gamma.DIST（Number1，Number2，Number3，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GAMMADIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Gamma分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">GamMADIST（Number1，Number2，Number3，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GAMMALN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Gamma函数的自然对数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 伽马（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GAMMALN.PRECISE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Gamma函数的自然对数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 伽马精密度（数量）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GAMMA.INV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆Gamma分布值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">伽马INV（编号1、编号2、编号3）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GAMMAINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆Gamma分布值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">GAMMAINV（编号1、编号2、编号3）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GAUSS</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回高斯变量从平均值下降超过此标准差的次数的概率。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> GAUSS（数字）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">GEOMEAN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回几何平均值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">GEOMEAN（编号1，编号2，.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HARMEAN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回调和平均值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">HARMEAN（编号1，编号2，.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HYPGEOMDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回超几何分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">HYPGEOMDIST（Number 1，Number
            2，Number 3，Number 4，Boolean）：
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">HYPGEOM.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回超几何分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">使用的密码（Number 1，Number
            2，Number 3，Number 4，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LARGE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回一个范围内的第k个最大值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> LARGE（范围，K）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LOGNORM.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回对数正态分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">对数正态分布（X，平均值，标准差，众数）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LOGNORMDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回对数正态分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">LOGNORMDIST（X，均值，标准差，众数）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LOGNORM.INV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆对数正态分布的值。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">对数正态分布INV（P，平均值，标准差）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LOGNORMINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆对数正态分布的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">LOGNORMINV（P，平均值，标准差）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LOGINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆对数正态分布的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> LOGINV（P，平均值，标准差）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MAX</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数列表中的最大值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">MAX（Number1，Number2，.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MAXA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数列表中的最大值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">MAXA（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MAXIFS</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回区域中满足一组条件的单元格的最大值。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">MAXIFS（Max_Range，Criterion_range1，Criterion1
            [，Criterion_range2，Criterion2 [，...]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MEDIAN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回一组数字的中位数。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">MEDIAN（数字1，数字2，.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MIN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数列表中的最小值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">MIN（Number1，Number2，.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MINA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回参数列表中的最小值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">MINA（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MINIFS</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回区域中满足一组条件的单元格的最小值。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">MINIFS（Min_Range，Criterion_range1，Criterion1
            [，Criterion_range2，Criterion2 [，...]]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NEGBINOM.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回负二项分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">NEGBINOM.
            DIST（编号1、编号2、编号3、模式）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NEGBINOMDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回负二项分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">NEGBINOMDIST（编号1、编号2、编号3、模式）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NORM.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回正态分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">标准距离（X，平均值，标准差，模式）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NORMDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回正态分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">NORMDIST（X，平均值，标准差，模式）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NORM.S.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回正态分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> NORM.S.DIST（X，模式）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NORMDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回正态分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> NORMSDIST（X，模式）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NORM.INV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆正态分布的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">标准INV（P，平均值，标准差）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NORMINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆正态分布的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> NORMINV（P，平均值，标准差）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NORM.S.INV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆正态分布的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 标准S INV（P）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">NORMSINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆正态分布的值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">NORMSINV(P)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">PEARSON</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回两个数据集之间的相关系数。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> PEARSON（数据1，数据2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">PHI</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回正态分布的概率密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">PHI(X)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">POISSON</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Poisson分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> POISSON（X，均值，众数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">POISSON.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Poisson分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">POISSON. DIST（X，均值，众数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">POISSONDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Poisson分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">POISSONDIST（X，均值，众数）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">RSQ</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回两个数据集之间相关系数的平方。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> RSQ（数据1，数据2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SKEW</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回样本的偏度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">SKEW（编号1、编号2、.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SKEW.P</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回总体的偏度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">SKEW. P（编号1，编号2，.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SKEWP</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回总体的偏度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">SKEWP（编号1，编号2，.编号30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SLOPE</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回线性回归线的斜率。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 斜率（阵列1，阵列2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SMALL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回范围内第k个最小值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> SMALL（Range，K）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">STANDARDIZE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回标准化的值，包括期望值和标准偏差。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">标准化（X，平均值，标准差）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回样本的标准差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEV（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEVA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回样本的标准差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEVA（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEVP</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回总体的标准差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEVP（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEV.P</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回总体的标准差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEV.P（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEVPA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回总体的标准差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEVPA（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEV.S</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回样本的标准差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEV.S（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEVS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回样本的标准差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">STDEVS（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">STEYX</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回每个x值的预测y值的预测标准误差。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> STEYX（Array1，Array2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TDIST</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">Student-t分布的收益密度，双侧或右尾。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> TDIST（X，度，模式）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">T.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Student-t分布的密度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> T.DIST（X，度，模式）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">T.DIST.2T</td>
          <td colspan="1" rowspan="1" style="text-align: left;">Student-t分布的收益密度，双侧。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> T.DIST.2T（X，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TDIST2T</td>
          <td colspan="1" rowspan="1" style="text-align: left;">Student-t分布的收益密度，双侧。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> TDIST 2 T（X，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">T.DIST.RT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">Student-t分布的收益密度，右尾。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> T.DIST.RT（X，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TDISTRT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">Student-t分布的收益密度，右尾。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> TDISRT（X，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TINV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回双侧逆Student-t分布。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> TINV（P，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">T.INV</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回逆学生t分布。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> T.INV（P，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">T.INV.2T</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回双侧逆Student-t分布。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> T.INV.2T（P，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TINV2T</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回双侧逆Student-t分布。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> TINV 2 T（P，度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TTEST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数据集的t检验值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> TTEST（Array1，Array2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">T.TEST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数据集的t检验值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> T.TEST（Array1，Array2）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">VAR</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回样本的方差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">VAR（Value1，Value2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">VARA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回样本的方差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">VARA（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">VARP</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回总体的方差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">VARP（Value1，Value2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">VAR.P</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回总体的方差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">VAR.P（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">VARPA</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回总体的方差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">VARPA（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">VAR.S</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回样本的方差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">VAR.S（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">VARS</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回样本的方差。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">VARS（值1，值2，.价值30）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">WEIBULL</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Weibull分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">WEIBO（Number1，Number2，Number3，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">WEIBULL.DIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Weibull分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">WEIBO.DIST（Number1，Number2，Number3，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">WEIBULLDIST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回Weibull分布的密度。</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">WEIBULLDIST（Number1，Number2，Number3，Boolean）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">Z.TEST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数据集的z测试值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">Z. TEST（Array，X [，Sigma]）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">ZTEST</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回数据集的z测试值。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> ZTEST（Array，X [，Sigma]）</td>
        </tr>
        </tbody>
      </table>
      <h3 class={'arco-typography'} id={'text'}>文本</h3>
      <table style="width: auto; text-align: start;">
        <tbody>
        <tr>
          <th colspan="1" rowspan="1" style="text-align: left;">方法</th>
          <th colspan="1" rowspan="1" style="text-align: left;">描述</th>
          <th colspan="1" rowspan="1" style="text-align: left;">语法</th>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CHAR</td>
          <td colspan="1" rowspan="1" style="text-align: left;">根据当前代码表将数字转换为字符。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">CHAR(Number)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CLEAN</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回已"清除"换行符和其他不可打印字符的文本。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> CLEAN（"文本"）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CODE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回文本字符串中第一个字符的数字代码。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">CODE("Text")</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">CONCATENATE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">将多个文本字符串合并为一个字符串。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">CONCATENATE（“Text1”，.，“文本30”）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">EXACT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果两个文本字符串完全相同，则返回TRUE。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> EXACT（文本，文本）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">FIND</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回一个文本字符串在另一个文本字符串中的位置。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">FIND（“Text1”，“Text2”[，Number]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LEFT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">从文本字符串的左侧提取给定数目的字符。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> LEFT（“文本”，数字）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LEN</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回给定文本的长度。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">LEN("Text")</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">LOWER</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回转换为文本的文本。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">LOWER(Text)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">MID</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回从Start_position开始的给定长度的子字符串。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">MID（文本、起始位置、长度）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">PROPER</td>
          <td colspan="1" rowspan="1" style="text-align: left;">将给定的文本字符串中的单词大写。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> PROPER（“文本”）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">REPLACE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">替换从给定位置开始的给定长度的文本的子字符串。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">REPLACE（Text，Start_position，Length，New_text）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">REPT</td>
          <td colspan="1" rowspan="1" style="text-align: left;">重复给定次数的文本。</td>
          <td colspan="1" rowspan="1" style="text-align: left;"> REPT（“文本”，数字）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">RIGHT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">从文本字符串的右侧提取给定数目的字符。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> RIGHT（“文本”，数字）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SEARCH</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回Search_string在Text中的位置。不区分大小写。允许使用通配符。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">Search（Search_string，Text[，Start_position]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SPLIT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">使用空格字符作为分隔符分割提供的文本，并返回第二个参数指定的从零开始的位置处的子字符串。<br/><span
            style="color: rgb(71, 101, 130); background-color: rgba(27, 31, 35, 0.05);"><code>SPLIT("Lorem ipsum", 0) -&gt; "Lorem"</code></span><br/><span
            style="color: rgb(71, 101, 130); background-color: rgba(27, 31, 35, 0.05);"><code>SPLIT("Lorem ipsum", 1) -&gt; "ipsum"</code></span>
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> SPLIT（文本，索引）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">SUBSTITUTE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回字符串，其中Old_text的出现被New_text替换。如果提供了最后一个参数，则仅替换特定的匹配项。
          </td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">SUBSTITUTE（Text，Old_text，New_text，[Occurrence]）
          </td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">T</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">如果给定的值是文本，则返回文本，否则返回空字符串。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;">T(Value)</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TEXT</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">根据给定的格式将数字转换为文本。<br/><br/><code><br/>默认情况下，接受可以传递给
            dateFormats 选项的相同格式，但可以使用 stringifyDateTime 选项进一步自定义。</code></td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 文本（编号、格式）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">TRIM</td>
          <td colspan="1" rowspan="1" style="text-align: left;">从文本中删除多余的空格。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">TRIM("Text")</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">UNICHAR</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回使用提供的代码点创建的字符。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> 难民专员办事处（数目）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">UNICODE</td>
          <td colspan="1" rowspan="1"
              style="text-align: left;">返回文本第一个字符的Unicode码位。
          </td>
          <td colspan="1" rowspan="1" style="text-align: left;"> UNICODE（文本）</td>
        </tr>
        <tr>
          <td colspan="1" rowspan="1" style="text-align: left;">UPPER</td>
          <td colspan="1" rowspan="1" style="text-align: left;">返回转换为文本的文本。</td>
          <td colspan="1" rowspan="1" style="text-align: left;">UPPER(Text)</td>
        </tr>
        </tbody>
      </table>
      <hr/>
      <ol>
        <li>此函数的返回值符合OpenDocument标准，但返回类型不符合。参见兼容性注释。↩︎ ↩︎</li>
      </ol>
    </div>
  })
}
