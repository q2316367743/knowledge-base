import Handsontable from "handsontable";

export interface ColumnConditions {
    column: number;
    conditions: Handsontable.plugins.Filters.ConditionId[];
    operation: Handsontable.plugins.Filters.OperationType;
}

