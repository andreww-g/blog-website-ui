import type { ToastServiceMethods } from 'primevue/toastservice';
import type { ConfirmationServiceMethods } from 'primevue/confirmationservice';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import Calendar from 'primevue/calendar';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import InputSwitch from 'primevue/inputswitch';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import FileUpload from 'primevue/fileupload';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Checkbox from 'primevue/checkbox';
import Password from 'primevue/password';
import Textarea from 'primevue/textarea';
import MultiSelect from 'primevue/multiselect';
import Toast from 'primevue/toast';
import SplitButton from 'primevue/splitbutton';
import SelectButton from 'primevue/selectbutton';
import ConfirmDialog from 'primevue/confirmdialog';
import OverlayPanel from 'primevue/overlaypanel';
import BlockUI from 'primevue/blockui';
import Menu from 'primevue/menu';
import Sidebar from 'primevue/sidebar';
import InlineMessage from 'primevue/inlinemessage';
import Message from 'primevue/message';
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import Tag from 'primevue/tag';
import Chip from 'primevue/chip';
import ProgressSpinner from 'primevue/progressspinner';
import Tooltip from 'primevue/tooltip';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Timeline from 'primevue/timeline';
import ToggleButton from 'primevue/togglebutton';
import AutoComplete from 'primevue/autocomplete';
import DataView from 'primevue/dataview';
import Chips from 'primevue/chips';


export default defineNuxtPlugin((nuxtApp): { provide: { toast: ToastServiceMethods, confirm: ConfirmationServiceMethods } } => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: false });
    nuxtApp.vueApp.use(ConfirmationService);
    nuxtApp.vueApp.use(ToastService);
    nuxtApp.vueApp.component('Breadcrumb', Breadcrumb);
    nuxtApp.vueApp.component('Button', Button);
    nuxtApp.vueApp.component('Calendar', Calendar);
    nuxtApp.vueApp.component('Checkbox', Checkbox);
    nuxtApp.vueApp.component('Column', Column);
    nuxtApp.vueApp.component('ConfirmDialog', ConfirmDialog);
    nuxtApp.vueApp.component('DataTable', DataTable);
    nuxtApp.vueApp.component('Dropdown', Dropdown);
    nuxtApp.vueApp.component('FileUpload', FileUpload);
    nuxtApp.vueApp.component('InputMask', InputMask);
    nuxtApp.vueApp.component('InputNumber', InputNumber);
    nuxtApp.vueApp.component('InputSwitch', InputSwitch);
    nuxtApp.vueApp.component('InputText', InputText);
    nuxtApp.vueApp.component('InputGroup', InputGroup);
    nuxtApp.vueApp.component('InputGroupAddon', InputGroupAddon);
    nuxtApp.vueApp.component('MultiSelect', MultiSelect);
    nuxtApp.vueApp.component('OverlayPanel', OverlayPanel);
    nuxtApp.vueApp.component('Paginator', Paginator);
    nuxtApp.vueApp.component('Password', Password);
    nuxtApp.vueApp.component('SelectButton', SelectButton);
    nuxtApp.vueApp.component('SplitButton', SplitButton);
    nuxtApp.vueApp.component('TabView', TabView);
    nuxtApp.vueApp.component('TabPanel', TabPanel);
    nuxtApp.vueApp.component('Textarea', Textarea);
    nuxtApp.vueApp.component('Toast', Toast);
    nuxtApp.vueApp.component('BlockUI', BlockUI);
    nuxtApp.vueApp.component('Menu', Menu);
    nuxtApp.vueApp.component('Sidebar', Sidebar);
    nuxtApp.vueApp.component('InlineMessage', InlineMessage);
    nuxtApp.vueApp.component('Dialog', Dialog);
    nuxtApp.vueApp.directive('tooltip', Tooltip);
    nuxtApp.vueApp.component('RadioButton', RadioButton);
    nuxtApp.vueApp.component('Tag', Tag);
    nuxtApp.vueApp.component('Chip', Chip);
    nuxtApp.vueApp.component('ProgressSpinner', ProgressSpinner);
    nuxtApp.vueApp.component('Message', Message);
    nuxtApp.vueApp.component('Timeline', Timeline);
    nuxtApp.vueApp.component('ToggleButton', ToggleButton);
    nuxtApp.vueApp.component('AutoComplete', AutoComplete);
    nuxtApp.vueApp.component('Chips', Chips);
    nuxtApp.vueApp.component('DataView', DataView);

    return {
        provide: {
            toast: nuxtApp.vueApp.config.globalProperties.$toast,
            confirm: nuxtApp.vueApp.config.globalProperties.$confirm,
        },
    };
});
