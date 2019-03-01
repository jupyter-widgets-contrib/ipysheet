// @ts-ignore
import * as Handsontable from 'handsontable';

async function widgetRenderer(instance, td, row, col, prop, value, cellProperties) {
    // If it's a ghost-table, we do add the view
    // See https://github.com/handsontable/handsontable/blob/6.2.2/src/utils/ghostTable.js#L313-L314
    if (td.hasAttribute('ghost-table')) {
        // TODO Create a div and apply the widget layout to it, also apply the top CSS
        // class of the widget. How to retrieve CSS classes without a view?
        return;
    }
    if(cellProperties.widget_view) {
        let el = cellProperties.widget_view.el
        if(td.children.length == 1 && td.children[0] == el) {
            // great, widget view element was already added
        } else {
            // clean up leftover text or elements from previous renderings
            td.innerHTML = '';
            if(el) {
                // setting with and height to 100% makes the widget look ok in the table, but we may want to
                /// have a better method
                el.style.width = '100%';
                el.style.height = '100%';
                td.appendChild(el);
                cellProperties.widget_view.trigger('displayed')
            }
        }

    }

}

(Handsontable.cellTypes as any).registerCellType('widget', {
    renderer: widgetRenderer
});
