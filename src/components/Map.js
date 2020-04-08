import React from 'react'
import '../styles/Map.css'


export default function Map(props) {
    const { matrix } = props

    const getHeight = function() {
        return matrix.length;
      }
    const getWidth = function() {
        return matrix[0].length;
      }

    const getTileColor = function(x, y) {
        if (x < 0 || y < 0) return -1;
        if (y >= getHeight()) return -1;
        if (x >= getWidth()) return -1;
        return matrix[y][x];
      }

    const drawMapTable = () => {
        let htm = '<table><tbody>';
        for (var y = 0; y < matrix.length; ++y) {
          var row = matrix[y];
          htm += '<tr>'
          for (var x = 0; x < row.length; ++x) {
            var color = getTileColor(x, y);
            htm += '<td class="m' + color + '"></td>';
          }
          htm += '</tr>';
        }
        htm += '</tbody></table>';
        return htm
      }

    return(
        <div dangerouslySetInnerHTML={{ __html: drawMapTable() }}>
        </div>
    )
}