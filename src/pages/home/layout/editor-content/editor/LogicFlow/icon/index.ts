import IconProCircle from './basic/Circle.vue'
import IconProRect from './basic/Rect.vue'
import IconProDiamond from './basic/Diamond.vue'
import IconProEllipse from './basic/Ellipse.vue'
import IconRectRadius from './basic/RectRadius.vue'
import IconTrapezoid from './basic/Trapezoid.vue'
import IconTriangle from './basic/Triangle.vue'
import IconCylinde from './basic/Cylinde.vue'
import IconParallelogram from './basic/Parallelogram.vue'
// 五边形
import IconPentagon from './basic/Pentagon.vue'
// 六边形
import IconHexagon from './basic/Hexagon.vue'
import IconHeptagon from './basic/Heptagon.vue';
import IconOctagon from './basic/Octagon.vue';

import IconActor from './special/Actor.vue'
import IconProText from './special/Text.vue'
import IconCross from './special/Cross.vue'
import IconMinus from './special/Minus.vue'
import IconTimes from './special/Times.vue'
import IconDivide from './special/Divide.vue';

import IconLeftArrow from './arrow/LeftArrow.vue'
import IconRightArrow from './arrow/RightArrow.vue'
import IconHorizontalArrow from './arrow/HorizontalArrow.vue'
import IconUpArrow from './arrow/UpArrow.vue'
import IconDownArrow from './arrow/DownArrow.vue'
import IconVerticalArrow from './arrow/VerticalArrow.vue'

// 流程图节点
import IconLctComment from './lct/comment.vue';
import IconLctComment2 from './lct/comment2.vue';
import IconLctCard from './lct/card.vue';
import {App} from "vue";

export const LogicFlowIcon = {
    install: (app: App) => {
        app.component("IconProCircle", IconProCircle);
        app.component("IconProRect", IconProRect);
        app.component("IconRectRadius", IconRectRadius);
        app.component("IconActor", IconActor);
        app.component("IconCylinde", IconCylinde);
        app.component("IconProDiamond", IconProDiamond);
        app.component("IconProEllipse", IconProEllipse);
        app.component("IconParallelogram", IconParallelogram);
        app.component("IconProText", IconProText);
        app.component("IconTriangle", IconTriangle);
        app.component("IconRightArrow", IconRightArrow);
        app.component("IconLeftArrow", IconLeftArrow);
        app.component("IconHorizontalArrow", IconHorizontalArrow);
        app.component("IconUpArrow", IconUpArrow);
        app.component("IconDownArrow", IconDownArrow);
        app.component("IconVerticalArrow", IconVerticalArrow);
        app.component("IconPentagon", IconPentagon);
        app.component("IconHexagon", IconHexagon);
        app.component("IconTrapezoid", IconTrapezoid);
        app.component("IconCross", IconCross);
        app.component("IconMinus", IconMinus);
        app.component("IconTimes", IconTimes);
        app.component("IconDivide", IconDivide);
        app.component("IconHeptagon", IconHeptagon);
        app.component("IconOctagon", IconOctagon);
        app.component("IconLctComment", IconLctComment);
        app.component("IconLctComment2", IconLctComment2);
        app.component("IconLctCard", IconLctCard);
    }
}

