import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import '../styles/Map.css';

const VISITED_COLOR = 0;

export default function Map() {
  const [matrix, setMatrix] = useState([
    [5, 4, 4],
    [4, 3, 4],
    [3, 2, 4],
    [2, 2, 2],
    [3, 3, 4],
    [1, 4, 4],
    [4, 1, 1],
  ]);

  const [numberOfCountries, setNumberOfCountries] = useState(0);

  const drawMapTable = function () {
    console.log(matrix);
    let htm = '<table><tbody>';
    for (let y = 0; y < matrix.length; ++y) {
      const row = matrix[y];
      htm += '<tr>';
      for (let x = 0; x < row.length; ++x) {
        const color = getTileColor(x, y);
        htm += `<td class="m${color}"></td>`;
      }
      htm += '</tr>';
    }
    htm += '</tbody></table>';
    return htm;
  };

  const renderGrid = function (matrix) {
    const map = arrayClone(matrix);
    return map.map((line, index) => (
      <tr key={index}>
        {
        line.map((item, index) => (
          <td className={`m${item}`} key={index}>{item}</td>
        ))
        }
      </tr>
    ));
  };

  const arrayClone = function (arr) {
    let i; let
      copy;

    if (Array.isArray(arr)) {
      copy = arr.slice(0);
      for (i = 0; i < copy.length; i++) {
        copy[i] = arrayClone(copy[i]);
      }
      return copy;
    } if (typeof arr === 'object') {
      throw 'Cannot clone array containing an object!';
    } else {
      return arr;
    }
  };

  const getTileColor = (x, y, numberColumns, numberRow) => {
    const matrixClone = arrayClone(matrix);
    if (x < 0 || y < 0) return -1;
    if (y >= numberRow) return -1;
    if (x >= numberColumns) return -1;
    return matrixClone[y][x];
  };

  const setTileColor = (map, x, y, c, height) => {
    if (x < 0 || y < 0) return;
    if (y >= height) return;
    const row = map[y];
    if (x >= row.length) return;
    map[y][x] = c;
  };

  /**
 * elementary recursive floodfill algorithm (use a non-recursive version for large maps!)
 * @param map the MapGrid instance to floodfill
 * @param x the x coord of tile to flood fill from
 * @param y the y coord of tile to flood fill from
 * @param colorToReplace the target color we're looking to fill
 * @param colorToUse the color to fill with
 */
  const floodfill = (map, x, y, colorToReplace, colorToUse) => {
    const height = map.length;
    const width = map[0].length;

    if (x < 0 || x >= width) return;
    if (y < 0 || y >= height) return;
    const tileColor = getTileColor(x, y);
    if (tileColor === colorToUse) return;
    if (tileColor !== colorToReplace) return;
    setTileColor(map, x, y, colorToUse, height);
    floodfill(map, x, y - 1, colorToReplace, colorToUse); // floodfill tile to North
    floodfill(map, x - 1, y, colorToReplace, colorToUse); // floodfill tile to the West
    floodfill(map, x + 1, y, colorToReplace, colorToUse); // floodfill tile to the East
    floodfill(map, x, y + 1, colorToReplace, colorToUse); // floodfill tile to the South
  };

  const countCountries = () => {
    const map = matrix;
    let counter = 0;

    // Height
    const numberRow = map.length;
    // Width
    const numberColumns = map[0].length;

    for (let x = 0; x < numberColumns; ++x) {
      for (let y = 0; y < numberRow; ++y) {
        console.log(`[${y},${x}]: ${getTileColor(x, y, numberColumns, numberRow)}`);
        const countryColor = getTileColor(x, y, numberColumns, numberRow);
        if (countryColor !== VISITED_COLOR) {
          counter++;
          floodfill(map, x, y, countryColor, VISITED_COLOR);
        }
      }
    }

    setNumberOfCountries(counter);
  };

  return (
    <div className="container">
      {/* <div dangerouslySetInnerHTML={{ __html: drawMapTable() }} /> */}
      <div>
        <table>
          <tbody>
            {renderGrid(matrix)}
          </tbody>
        </table>
      </div>
      {
        (numberOfCountries !== 0) ? (
          <h2>
            Countries Counted:
            {' '}
            <span>{numberOfCountries}</span>
          </h2>
        ) : null

      }
      <div className="group-button">
        <Button
          variant="contained"
          onClick={countCountries}
        >
          Count Countries
        </Button>
        <Button
          variant="contained"
        >
          Count countries showing working
        </Button>
      </div>
    </div>
  );
}
