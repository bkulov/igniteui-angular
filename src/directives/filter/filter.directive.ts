import { CommonModule } from "@angular/common";
import { Directive,
         ElementRef,
         EventEmitter,
         Input,
         NgModule,
         OnChanges,
         Output,
         Pipe,
         PipeTransform,
         Renderer2,
         SimpleChanges } from "@angular/core";

@Directive({
    selector: "[igxFilter]"
})
export class IgxFilterDirective implements OnChanges {
    @Output() public filtering = new EventEmitter(false); // synchronous event emitter
    @Output() public filtered = new EventEmitter();

    @Input("igxFilter") public filterOptions: IgxFilterOptions;

    constructor(private element: ElementRef, renderer: Renderer2) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        // Detect only changes of input value
        if (changes.filterOptions &&
            changes.filterOptions.currentValue &&
            changes.filterOptions.currentValue.inputValue !== undefined &&
            changes.filterOptions.previousValue &&
            changes.filterOptions.currentValue.inputValue !== changes.filterOptions.previousValue.inputValue) {
            this.filter();
        }
    }

    private filter() {
        if (!this.filterOptions.items) {
            return;
        }

        const args = { cancel: false, items: this.filterOptions.items };
        this.filtering.emit(args);

        if (args.cancel) {
            return;
        }

        const pipe = new IgxFilterPipe();

        const filtered = pipe.transform(this.filterOptions.items, this.filterOptions);
        this.filtered.emit({ filteredItems: filtered });
    }
}

@Pipe({
    name: "igxFilter",
    pure: false
})

export class IgxFilterPipe implements PipeTransform {
    public transform(items: any[],
                     // options - initial settings of filter functionality
                     options: IgxFilterOptions) {

        let result = [];

        if (!items || !items.length || !options) {
            return;
        }

        if (options.items) {
            items = options.items;
        }

        result = items.filter((item: any) => {
            const match = options.matchFn(options.formatter(options.get_value(item, options.key)), options.inputValue);

            if (match) {
                if (options.metConditionFn) {
                    options.metConditionFn(item);
                }
            } else {
                if (options.overdueConditionFn) {
                    options.overdueConditionFn(item);
                }
            }

            return match;
        });

        return result;
    }
}

export class IgxFilterOptions {
    // Input text value that will be used as a filtering pattern (matching condition is based on it)
    public inputValue = "";

    // Item property, which value should be used for filtering
    public key: string;

    // Represent items of the list. It should be used to handle decalaratevely defined widgets
    public items: any[];

    // Function - get value to be tested from the item
    // item - single item of the list to be filtered
    // key - property name of item, which value should be tested
    // Default behavior - returns "key"- named property value of item if key si provided,
    // otherwise textContent of the item's html element
    public get_value(item: any, key: string): string {
        let result = "";

        if (key) {
            result = item[key].toString();
        } else if (item.element && item.element.nativeElement) {
            result = item.element.nativeElement.textContent.trim();
        }

        return result;
    }

    // Function - formats the original text before matching process
    // Default behavior - returns text to lower case
    public formatter(valueToTest: string): string {
        return valueToTest.toLowerCase();
    }

    // Function - determines whether the item met the condition
    // valueToTest - text value that should be tested
    // inputValue - text value from input that condition is based on
    // Default behavior - "contains"
    public matchFn(valueToTest: string, inputValue: string): boolean {
        return valueToTest.indexOf(inputValue && inputValue.toLowerCase() || "") > -1;
    }

    // Function - executed after matching test for every matched item
    // Default behavior - shows the item
    public metConditionFn(item: any) {
        if (item.hasOwnProperty("hidden")) {
            item.hidden = false;
        }
    }

    // Function - executed for every NOT matched item after matching test
    // Default behavior - hides the item
    public overdueConditionFn(item: any) {
        if (item.hasOwnProperty("hidden")) {
            item.hidden = true;
        }
    }
}

@NgModule({
    declarations: [IgxFilterDirective, IgxFilterPipe],
    exports: [IgxFilterDirective, IgxFilterPipe],
    imports: [CommonModule]
})
export class IgxFilterModule {
}
