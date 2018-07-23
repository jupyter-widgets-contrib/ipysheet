
import ipywidgets as wg
import ipysheet

from IPython.display import display


class LargeSheetInTab:
    """
    """

    def __init__(self):
        """
        """

        self.layout_sheet = wg.Layout(
            align_self='baseline',
            overflow_y='scroll'
        )

        self.layout_container = wg.Layout(
            width='750px',
            height='600px',
        )

        self.build_all()

    def show_box(self):
        """
        """
        return self.w_box_1

    def show_sheet(self):
        """
        """
        return self.w_sheet_1

    def show_output(self):
        """
        """
        return self.w_output_1

    def show_tab_output(self):
        """
        """
        return self.w_tab_output

    def show_tab_box(self):
        """
        """
        return self.w_tab_box

    def build_sheet(self, idx):
        """
        """
        w_sheet = ipysheet.sheet(rows=3,
                                 columns=4,
                                 stretch_headers='none',
                                 column_width=[120, 120, 120, 120],
                                 layout=self.layout_sheet)
        w_sheet.column_headers = ['AA',
                                  'BB',
                                  'CC',
                                  'DD']
        test = []
        for i in range(0, 100):
            data = {}
            data['AA'] = 'a'+str(idx)
            data['BB'] = 'b'+str(idx)
            data['CC'] = 'c'+str(idx)
            data['DD'] = 'd'+str(idx)
            test.append(data)
        w_sheet.rows = len(test)

        cells = []
        style_cell = {'textAlign': 'center'}
        for k, e in enumerate(test):
            i = 0
            cell = ipysheet.cell(k, i, e['AA'], style=style_cell)
            cells.append(cell)
            i += 1
            cell = ipysheet.cell(k, i, e['BB'], style=style_cell)
            cells.append(cell)
            i += 1
            cell = ipysheet.cell(k, i, e['CC'], style=style_cell)
            cells.append(cell)
            i += 1
            cell = ipysheet.cell(k, i, e['DD'], style=style_cell)
            cells.append(cell)

        w_sheet.cells = cells
        return w_sheet

    def build_all(self):
        """
        """

        self.w_sheet_1 = self.build_sheet(1)
        self.w_sheet_2 = self.build_sheet(2)

        w_box_1 = wg.Box(layout=self.layout_container)
        w_box_1.children = [self.w_sheet_1]
        self.w_box_1 = w_box_1

        w_box_2 = wg.Box(layout=self.layout_container)
        w_box_2.children = [self.w_sheet_2]
        self.w_box_2 = w_box_2

        self.w_output_1 = wg.Output(layout=self.layout_container)
        self.w_output_2 = wg.Output(layout=self.layout_container)

        with self.w_output_1:
            display(self.w_sheet_1)

        with self.w_output_2:
            display(self.w_sheet_2)

        self.w_tab_output = wg.Tab(children=[self.w_output_1,
                                             self.w_output_2])
        self.w_tab_box = wg.Tab(children=[self.w_box_1,
                                          self.w_box_2])
