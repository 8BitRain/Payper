/**
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
  *   💣  Sort.js  💣
  *
  *   contains abstractions of Javascript's sort() function
  *
  *   💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣💣
  *
**/


/**
  *
**/
export function sort(set, order, sortby) {
  switch (order) {
    case "ascending":
      set.sort(function(a, b) {
        return parseFloat(b.sortby) - parseFloat(a.sortby);
      });
    break;
    case "descending":

    break;
  }
};
