import { async, TestBed } from '@angular/core/testing';
import { IgxGridModule } from './grid.module';
import { IgxGridComponent } from './grid.component';
import { Component, ViewChild, QueryList } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxColumnComponent, IgxColumnGroupComponent } from './column.component';

const expectedColumnGroups = 5;
const expectedLevel = 2;

describe('IgxGrid - multi-column headers', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OneGroupOneColGridComponent,
                OneGroupThreeColsGridComponent,
                ColumnGroupTestComponent
            ],
            imports: [
                NoopAnimationsModule,
                IgxGridModule.forRoot()
            ]
        })
        .compileComponents();
    }));


    it('should initialize a grid with column groups', () => {
        const fixture = TestBed.createComponent(ColumnGroupTestComponent);
        fixture.detectChanges();
        const grid = fixture.componentInstance.grid;

        expect(grid.columnList.filter(col => col.columnGroup).length).toEqual(expectedColumnGroups);
        expect(grid.getColumnByName('ContactName').level).toEqual(expectedLevel);
    });

    it('column hiding - parent level', () => {
        const fixture = TestBed.createComponent(ColumnGroupTestComponent);
        fixture.detectChanges();
        const grid = fixture.componentInstance.grid;
        const addressGroup = grid.columnList.filter(c => c.header === 'Address Information')[0];

        addressGroup.hidden = true;
        fixture.detectChanges();

        expect(document.querySelectorAll('igx-grid-header').length).toEqual(6);
    });

    it('column hiding - child level', () => {
        const fixture = TestBed.createComponent(ColumnGroupTestComponent);
        fixture.detectChanges();
        const grid = fixture.componentInstance.grid;
        const addressGroup = grid.columnList.filter(c => c.header === 'Address Information')[0];

        addressGroup.children.first.hidden = true;
        fixture.detectChanges();

        expect(document.querySelectorAll('igx-grid-header').length).toEqual(11);
        expect(addressGroup.children.first.hidden).toBe(true);
        expect(addressGroup.children.first.children.toArray().every(c => c.hidden === true)).toEqual(true);
    });

    it('Width should be correct. Column group with column. No width.', () => {
        const fixture = TestBed.createComponent(OneGroupOneColGridComponent);
        fixture.detectChanges();

        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(componentInstance.gridWrapperWidthPx);
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(componentInstance.gridWrapperWidthPx);
    });

    it('Width should be correct. Column group with column. Width in px.', () => {
        const fixture = TestBed.createComponent(OneGroupOneColGridComponent);
        const gridWidth = '600px';
        const gridWidthPx = parseInt(gridWidth, 10);
        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        grid.width = gridWidth;
        fixture.detectChanges();

        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(gridWidthPx.toString());
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(gridWidthPx.toString());
    });

    it('Width should be correct. Column group with column. Width in percent.', () => {
        const fixture = TestBed.createComponent(OneGroupOneColGridComponent);
        const gridWidth = '50%';
        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        grid.width = gridWidth;
        fixture.detectChanges();

        const locationColGroup = getColGroup(grid, 'Location');
        const gridWidthInPx = (parseInt(gridWidth, 10) / 100) *
            parseInt(componentInstance.gridWrapperWidthPx, 10);
        expect(locationColGroup.width).toBe(gridWidthInPx.toString());
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(gridWidthInPx.toString());
    });

    it('Width should be correct. Column group with column. Column width in px.', () => {
        const fixture = TestBed.createComponent(OneGroupOneColGridComponent);
        const gridColWidth = '200px';
        const gridColWidthPx = parseInt(gridColWidth, 10);
        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        grid.columnWidth = gridColWidth;
        fixture.detectChanges();

        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(gridColWidthPx.toString());
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(gridColWidth);
    });

    it('Width should be correct. Column group with column. Column width in percent.', () => {
        const fixture = TestBed.createComponent(OneGroupOneColGridComponent);
        const gridColWidth = '50%';
        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        grid.columnWidth = gridColWidth;
        fixture.detectChanges();

        const colGroupPx = (parseInt(gridColWidth, 10) / 100) *
            parseInt(componentInstance.gridWrapperWidthPx, 10);
        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(colGroupPx.toString());
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(gridColWidth);
    });

    it('Width should be correct. Column group with column. Column with width in px.', () => {
        const fixture = TestBed.createComponent(OneGroupOneColGridComponent);
        const columnWidth = '200px';
        const columnWidthPx = parseInt(columnWidth, 10);
        const componentInstance = fixture.componentInstance;
        componentInstance.columnWidth = columnWidth;
        const grid = componentInstance.grid;
        fixture.detectChanges();

        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(columnWidthPx.toString());
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(columnWidth);
    });

    it('Width should be correct. Column group with column. Column with width in percent.', () => {
        const fixture = TestBed.createComponent(OneGroupOneColGridComponent);
        const columnWidth = '50%';
        const componentInstance = fixture.componentInstance;
        componentInstance.columnWidth = columnWidth;
        const grid = componentInstance.grid;
        fixture.detectChanges();

        const colGroupPx = (parseInt(columnWidth, 10) / 100) *
            parseInt(componentInstance.gridWrapperWidthPx, 10);
        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(colGroupPx.toString());
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(columnWidth);
    });

    it('Width should be correct. Column group with three columns. No width.', () => {
        const fixture = TestBed.createComponent(OneGroupThreeColsGridComponent);
        fixture.detectChanges();

        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(componentInstance.gridWrapperWidthPx);
        const colWidth = parseInt(componentInstance.gridWrapperWidthPx, 10) / 3;
        const countryColumn = grid.getColumnByName('Country');
        expect(countryColumn.width).toBe(colWidth.toString());
        const regionColumn = grid.getColumnByName('Region');
        expect(regionColumn.width).toBe(colWidth.toString());
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(colWidth.toString());
    });

    it('Width should be correct. Column group with three columns. Width in px.', () => {
        const fixture = TestBed.createComponent(OneGroupThreeColsGridComponent);
        const gridWidth = '600px';
        const gridWidthInPx = parseInt(gridWidth, 10);
        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        grid.width = gridWidth;
        fixture.detectChanges();

        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(gridWidthInPx.toString());
        const colWidth = parseInt(gridWidth, 10) / 3;
        const countryColumn = grid.getColumnByName('Country');
        expect(countryColumn.width).toBe(colWidth.toString());
        const regionColumn = grid.getColumnByName('Region');
        expect(regionColumn.width).toBe(colWidth.toString());
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(colWidth.toString());
    });

    it('Width should be correct. Column group with three columns. Width in percent.', () => {
        const fixture = TestBed.createComponent(OneGroupThreeColsGridComponent);
        const gridWidth = '50%';
        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        grid.width = gridWidth;
        fixture.detectChanges();

        const gridWidthInPx = (parseInt(gridWidth, 10) / 100) *
            parseInt(componentInstance.gridWrapperWidthPx, 10);
        const colWidth = gridWidthInPx / 3;
        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(gridWidthInPx.toString());
        const countryColumn = grid.getColumnByName('Country');
        expect(countryColumn.width).toBe(colWidth.toString());
        const regionColumn = grid.getColumnByName('Region');
        expect(regionColumn.width).toBe(colWidth.toString());
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(colWidth.toString());
    });

    it('Width should be correct. Column group with three columns. Column width in px.', () => {
        const fixture = TestBed.createComponent(OneGroupThreeColsGridComponent);
        const gridColWidth = '200px';
        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        grid.columnWidth = gridColWidth;
        fixture.detectChanges();

        const locationColGroup = getColGroup(grid, 'Location');
        const gridWidth = parseInt(gridColWidth, 10) * 3;
        expect(locationColGroup.width).toBe(gridWidth.toString());
        const countryColumn = grid.getColumnByName('Country');
        expect(countryColumn.width).toBe(gridColWidth);
        const regionColumn = grid.getColumnByName('Region');
        expect(regionColumn.width).toBe(gridColWidth);
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(gridColWidth);
    });

    it('Width should be correct. Colum group with three columns. Column width in percent.', () => {
        const fixture = TestBed.createComponent(OneGroupThreeColsGridComponent);
        const gridColWidth = '20%';
        const componentInstance = fixture.componentInstance;
        const grid = componentInstance.grid;
        grid.columnWidth = gridColWidth;
        fixture.detectChanges();

        const groupWidthIxPx = (parseInt(gridColWidth, 10) / 100) *
            parseInt(componentInstance.gridWrapperWidthPx, 10) * 3;
        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(groupWidthIxPx.toString());
        const countryColumn = grid.getColumnByName('Country');
        expect(countryColumn.width).toBe(gridColWidth);
        const regionColumn = grid.getColumnByName('Region');
        expect(regionColumn.width).toBe(gridColWidth);
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(gridColWidth);
    });

    it('Width should be correct. Column group with three columns. Columns with width in px.', () => {
        const fixture = TestBed.createComponent(OneGroupThreeColsGridComponent);
        const columnWidth = '200px';
        const componentInstance = fixture.componentInstance;
        componentInstance.columnWidth = columnWidth;
        const grid = componentInstance.grid;
        fixture.detectChanges();

        const locationColGroup = getColGroup(grid, 'Location');
        const groupWidth = parseInt(columnWidth, 10) * 3;
        expect(locationColGroup.width).toBe(groupWidth.toString());
        const countryColumn = grid.getColumnByName('Country');
        expect(countryColumn.width).toBe(columnWidth);
        const regionColumn = grid.getColumnByName('Region');
        expect(regionColumn.width).toBe(columnWidth);
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(columnWidth);
    });

    it('Width should be correct. Column group with three columns. Columns with width in percent.', () => {
        const fixture = TestBed.createComponent(OneGroupThreeColsGridComponent);
        const columnWidth = '20%';
        const componentInstance = fixture.componentInstance;
        componentInstance.columnWidth = columnWidth;
        const grid = componentInstance.grid;
        fixture.detectChanges();

        const groupWidthIxPx = (parseInt(columnWidth, 10) / 100) *
            parseInt(componentInstance.gridWrapperWidthPx, 10) * 3;
        const locationColGroup = getColGroup(grid, 'Location');
        expect(locationColGroup.width).toBe(groupWidthIxPx.toString());
        const countryColumn = grid.getColumnByName('Country');
        expect(countryColumn.width).toBe(columnWidth);
        const regionColumn = grid.getColumnByName('Region');
        expect(regionColumn.width).toBe(columnWidth);
        const cityColumn = grid.getColumnByName('City');
        expect(cityColumn.width).toBe(columnWidth);
    });
});

@Component({
    template: `
    <div id="grid-wrapper" [style.width.px]="gridWrapperWidthPx">
        <igx-grid #grid [data]="data" [height]='gridHeight'>
            <igx-column-group header="Location">
                <igx-column field="City" [width]='columnWidth'></igx-column>
            </igx-column-group>
        </igx-grid>
    </div>
    `
})
export class OneGroupOneColGridComponent {
    @ViewChild('grid') public grid: IgxGridComponent;
    public gridWrapperWidthPx = '1000';
    public gridHeight = '500px';
    public columnWidth: string;
    data = DATASOURCE;
}

@Component({
    template: `
    <div id="grid-wrapper" [style.width.px]="gridWrapperWidthPx">
        <igx-grid #grid [data]="data" [height]='gridHeight'>
            <igx-column-group header="Location">
                <igx-column field="Country" [width]='columnWidth'></igx-column>
                <igx-column field="Region" [width]='columnWidth'></igx-column>
                <igx-column field="City" [width]='columnWidth'></igx-column>
            </igx-column-group>
        </igx-grid>
    </div>
    `
})
export class OneGroupThreeColsGridComponent {
    @ViewChild('grid') public grid: IgxGridComponent;
    public gridWrapperWidthPx = '900';
    public gridHeight = '500px';
    public columnWidth: string;
    data = DATASOURCE;
}

@Component({
    template: `
    <igx-grid #grid [data]="data">
        <igx-column field="ID"></igx-column>
        <igx-column-group header="General Information">
            <igx-column filterable="true" sortable="true" resizable="true" field="CompanyName"></igx-column>
            <igx-column-group header="Person Details">
                <igx-column filterable="true" sortable="true" resizable="true" field="ContactName"></igx-column>
                <igx-column filterable="true" sortable="true" resizable="true" field="ContactTitle"></igx-column>
            </igx-column-group>
        </igx-column-group>
        <igx-column-group header="Address Information">
            <igx-column-group header="Location">
                <igx-column filterable="true" sortable="true" resizable="true" field="Country"></igx-column>
                <igx-column filterable="true" sortable="true" resizable="true" field="Region"></igx-column>
                <igx-column filterable="true" sortable="true" resizable="true" field="City"></igx-column>
                <igx-column filterable="true" sortable="true" resizable="true" field="Address"></igx-column>
            </igx-column-group>
            <igx-column-group header="Contact Information">
                <igx-column filterable="true" sortable="true" resizable="true" field="Phone"></igx-column>
                <igx-column filterable="true" sortable="true" resizable="true" field="Fax"></igx-column>
                <igx-column filterable="true" sortable="true" resizable="true" field="PostalCode"></igx-column>
            </igx-column-group>
        </igx-column-group>
    </igx-grid>
    `
})
export class ColumnGroupTestComponent {
    @ViewChild(IgxGridComponent, { read: IgxGridComponent })
    grid: IgxGridComponent;

    data = DATASOURCE;
}

export const DATASOURCE = [
    // tslint:disable:max-line-length
    { 'ID': 'ALFKI', 'CompanyName': 'Alfreds Futterkiste', 'ContactName': 'Maria Anders', 'ContactTitle': 'Sales Representative', 'Address': 'Obere Str. 57', 'City': 'Berlin', 'Region': null, 'PostalCode': '12209', 'Country': 'Germany', 'Phone': '030-0074321', 'Fax': '030-0076545' },
    { 'ID': 'ANATR', 'CompanyName': 'Ana Trujillo Emparedados y helados', 'ContactName': 'Ana Trujillo', 'ContactTitle': 'Owner', 'Address': 'Avda. de la Constitución 2222', 'City': 'México D.F.', 'Region': null, 'PostalCode': '05021', 'Country': 'Mexico', 'Phone': '(5) 555-4729', 'Fax': '(5) 555-3745' },
    { 'ID': 'ANTON', 'CompanyName': 'Antonio Moreno Taquería', 'ContactName': 'Antonio Moreno', 'ContactTitle': 'Owner', 'Address': 'Mataderos 2312', 'City': 'México D.F.', 'Region': null, 'PostalCode': '05023', 'Country': 'Mexico', 'Phone': '(5) 555-3932', 'Fax': null },
    { 'ID': 'AROUT', 'CompanyName': 'Around the Horn', 'ContactName': 'Thomas Hardy', 'ContactTitle': 'Sales Representative', 'Address': '120 Hanover Sq.', 'City': 'London', 'Region': null, 'PostalCode': 'WA1 1DP', 'Country': 'UK', 'Phone': '(171) 555-7788', 'Fax': '(171) 555-6750' },
    { 'ID': 'BERGS', 'CompanyName': 'Berglunds snabbköp', 'ContactName': 'Christina Berglund', 'ContactTitle': 'Order Administrator', 'Address': 'Berguvsvägen 8', 'City': 'Luleå', 'Region': null, 'PostalCode': 'S-958 22', 'Country': 'Sweden', 'Phone': '0921-12 34 65', 'Fax': '0921-12 34 67' },
    { 'ID': 'BLAUS', 'CompanyName': 'Blauer See Delikatessen', 'ContactName': 'Hanna Moos', 'ContactTitle': 'Sales Representative', 'Address': 'Forsterstr. 57', 'City': 'Mannheim', 'Region': null, 'PostalCode': '68306', 'Country': 'Germany', 'Phone': '0621-08460', 'Fax': '0621-08924' },
    { 'ID': 'BLONP', 'CompanyName': 'Blondesddsl père et fils', 'ContactName': 'Frédérique Citeaux', 'ContactTitle': 'Marketing Manager', 'Address': '24, place Kléber', 'City': 'Strasbourg', 'Region': null, 'PostalCode': '67000', 'Country': 'France', 'Phone': '88.60.15.31', 'Fax': '88.60.15.32' },
    { 'ID': 'BOLID', 'CompanyName': 'Bólido Comidas preparadas', 'ContactName': 'Martín Sommer', 'ContactTitle': 'Owner', 'Address': 'C/ Araquil, 67', 'City': 'Madrid', 'Region': null, 'PostalCode': '28023', 'Country': 'Spain', 'Phone': '(91) 555 22 82', 'Fax': '(91) 555 91 99' },
    { 'ID': 'BONAP', 'CompanyName': 'Bon app\'', 'ContactName': 'Laurence Lebihan', 'ContactTitle': 'Owner', 'Address': '12, rue des Bouchers', 'City': 'Marseille', 'Region': null, 'PostalCode': '13008', 'Country': 'France', 'Phone': '91.24.45.40', 'Fax': '91.24.45.41' },
    { 'ID': 'BOTTM', 'CompanyName': 'Bottom-Dollar Markets', 'ContactName': 'Elizabeth Lincoln', 'ContactTitle': 'Accounting Manager', 'Address': '23 Tsawassen Blvd.', 'City': 'Tsawassen', 'Region': 'BC', 'PostalCode': 'T2F 8M4', 'Country': 'Canada', 'Phone': '(604) 555-4729', 'Fax': '(604) 555-3745' },
    { 'ID': 'BSBEV', 'CompanyName': 'B\'s Beverages', 'ContactName': 'Victoria Ashworth', 'ContactTitle': 'Sales Representative', 'Address': 'Fauntleroy Circus', 'City': 'London', 'Region': null, 'PostalCode': 'EC2 5NT', 'Country': 'UK', 'Phone': '(171) 555-1212', 'Fax': null },
    { 'ID': 'CACTU', 'CompanyName': 'Cactus Comidas para llevar', 'ContactName': 'Patricio Simpson', 'ContactTitle': 'Sales Agent', 'Address': 'Cerrito 333', 'City': 'Buenos Aires', 'Region': null, 'PostalCode': '1010', 'Country': 'Argentina', 'Phone': '(1) 135-5555', 'Fax': '(1) 135-4892' },
    { 'ID': 'CENTC', 'CompanyName': 'Centro comercial Moctezuma', 'ContactName': 'Francisco Chang', 'ContactTitle': 'Marketing Manager', 'Address': 'Sierras de Granada 9993', 'City': 'México D.F.', 'Region': null, 'PostalCode': '05022', 'Country': 'Mexico', 'Phone': '(5) 555-3392', 'Fax': '(5) 555-7293' },
    { 'ID': 'CHOPS', 'CompanyName': 'Chop-suey Chinese', 'ContactName': 'Yang Wang', 'ContactTitle': 'Owner', 'Address': 'Hauptstr. 29', 'City': 'Bern', 'Region': null, 'PostalCode': '3012', 'Country': 'Switzerland', 'Phone': '0452-076545', 'Fax': null },
    { 'ID': 'COMMI', 'CompanyName': 'Comércio Mineiro', 'ContactName': 'Pedro Afonso', 'ContactTitle': 'Sales Associate', 'Address': 'Av. dos Lusíadas, 23', 'City': 'Sao Paulo', 'Region': 'SP', 'PostalCode': '05432-043', 'Country': 'Brazil', 'Phone': '(11) 555-7647', 'Fax': null },
    { 'ID': 'CONSH', 'CompanyName': 'Consolidated Holdings', 'ContactName': 'Elizabeth Brown', 'ContactTitle': 'Sales Representative', 'Address': 'Berkeley Gardens 12 Brewery', 'City': 'London', 'Region': null, 'PostalCode': 'WX1 6LT', 'Country': 'UK', 'Phone': '(171) 555-2282', 'Fax': '(171) 555-9199' },
    { 'ID': 'DRACD', 'CompanyName': 'Drachenblut Delikatessen', 'ContactName': 'Sven Ottlieb', 'ContactTitle': 'Order Administrator', 'Address': 'Walserweg 21', 'City': 'Aachen', 'Region': null, 'PostalCode': '52066', 'Country': 'Germany', 'Phone': '0241-039123', 'Fax': '0241-059428' },
    { 'ID': 'DUMON', 'CompanyName': 'Du monde entier', 'ContactName': 'Janine Labrune', 'ContactTitle': 'Owner', 'Address': '67, rue des Cinquante Otages', 'City': 'Nantes', 'Region': null, 'PostalCode': '44000', 'Country': 'France', 'Phone': '40.67.88.88', 'Fax': '40.67.89.89' },
    { 'ID': 'EASTC', 'CompanyName': 'Eastern Connection', 'ContactName': 'Ann Devon', 'ContactTitle': 'Sales Agent', 'Address': '35 King George', 'City': 'London', 'Region': null, 'PostalCode': 'WX3 6FW', 'Country': 'UK', 'Phone': '(171) 555-0297', 'Fax': '(171) 555-3373' },
    { 'ID': 'ERNSH', 'CompanyName': 'Ernst Handel', 'ContactName': 'Roland Mendel', 'ContactTitle': 'Sales Manager', 'Address': 'Kirchgasse 6', 'City': 'Graz', 'Region': null, 'PostalCode': '8010', 'Country': 'Austria', 'Phone': '7675-3425', 'Fax': '7675-3426' },
    { 'ID': 'FAMIA', 'CompanyName': 'Familia Arquibaldo', 'ContactName': 'Aria Cruz', 'ContactTitle': 'Marketing Assistant', 'Address': 'Rua Orós, 92', 'City': 'Sao Paulo', 'Region': 'SP', 'PostalCode': '05442-030', 'Country': 'Brazil', 'Phone': '(11) 555-9857', 'Fax': null },
    { 'ID': 'FISSA', 'CompanyName': 'FISSA Fabrica Inter. Salchichas S.A.', 'ContactName': 'Diego Roel', 'ContactTitle': 'Accounting Manager', 'Address': 'C/ Moralzarzal, 86', 'City': 'Madrid', 'Region': null, 'PostalCode': '28034', 'Country': 'Spain', 'Phone': '(91) 555 94 44', 'Fax': '(91) 555 55 93' },
    { 'ID': 'FOLIG', 'CompanyName': 'Folies gourmandes', 'ContactName': 'Martine Rancé', 'ContactTitle': 'Assistant Sales Agent', 'Address': '184, chaussée de Tournai', 'City': 'Lille', 'Region': null, 'PostalCode': '59000', 'Country': 'France', 'Phone': '20.16.10.16', 'Fax': '20.16.10.17' },
    { 'ID': 'FOLKO', 'CompanyName': 'Folk och fä HB', 'ContactName': 'Maria Larsson', 'ContactTitle': 'Owner', 'Address': 'Åkergatan 24', 'City': 'Bräcke', 'Region': null, 'PostalCode': 'S-844 67', 'Country': 'Sweden', 'Phone': '0695-34 67 21', 'Fax': null },
    { 'ID': 'FRANK', 'CompanyName': 'Frankenversand', 'ContactName': 'Peter Franken', 'ContactTitle': 'Marketing Manager', 'Address': 'Berliner Platz 43', 'City': 'München', 'Region': null, 'PostalCode': '80805', 'Country': 'Germany', 'Phone': '089-0877310', 'Fax': '089-0877451' },
    { 'ID': 'FRANR', 'CompanyName': 'France restauration', 'ContactName': 'Carine Schmitt', 'ContactTitle': 'Marketing Manager', 'Address': '54, rue Royale', 'City': 'Nantes', 'Region': null, 'PostalCode': '44000', 'Country': 'France', 'Phone': '40.32.21.21', 'Fax': '40.32.21.20' },
    { 'ID': 'FRANS', 'CompanyName': 'Franchi S.p.A.', 'ContactName': 'Paolo Accorti', 'ContactTitle': 'Sales Representative', 'Address': 'Via Monte Bianco 34', 'City': 'Torino', 'Region': null, 'PostalCode': '10100', 'Country': 'Italy', 'Phone': '011-4988260', 'Fax': '011-4988261' }
];
// tslint:enable:max-line-length

function getColGroup(grid: IgxGridComponent, headerName: string): IgxColumnGroupComponent {
    const colGroups = grid.columnList.filter(c => c.columnGroup && c.header === headerName);
    if (colGroups.length === 0) {
        return null;
    } else if (colGroups.length === 1) {
        return colGroups[0];
    } else {
        throw new Error('More than one column group found.');
    }
}
