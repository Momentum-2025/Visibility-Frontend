import React from "react";
import styles from "./GenericDataTable.module.css";

export interface GenericDataTableProps {
  columns: string[];
  data: Array<Record<string, React.ReactNode>>;
}

const GenericDataTable: React.FC<GenericDataTableProps> = ({ columns, data }) => {
  return (
    <div className={styles.tableOuter}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className={styles.headerCell}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={rIdx} className={styles.row}>
              {columns.map((col, cIdx) => (
                <td
                  key={col}
                  className={cIdx === 0 ? styles.topicCell : styles.bodyCell}
                >
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GenericDataTable;
