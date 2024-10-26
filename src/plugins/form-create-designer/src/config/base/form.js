
export default function form({t}) {
    return [
        {
            type: 'input',
            field: 'id',
            value: '',
            title: t('form.formId'), 
        },
        {
            type: 'input',
            field: 'formName',
            value: '',
            title: t('form.formName'), 
        }, 
        {
            type: 'MdpSelectCate',
            field: 'categoryId',
            value: '',
            title: t('form.categoryId'), 
        },
        {
            type: 'radio',
            field: 'labelPosition',
            value: 'left',
            title: t('form.labelPosition'),
            options: [
                {value: 'right', label: 'right'},
                {value: 'left', label: 'left'},
                {value: 'top', label: 'top'},
            ]
        }, {
            type: 'radio',
            field: 'size',
            value: 'small',
            title: t('form.size'),
            options: [
                {value: 'large', label: 'large'},
                {value: 'default', label: 'default'},
                {value: 'small', label: 'small'},
            ]
        }, {
            type: 'input',
            field: 'labelWidth',
            value: '125px',
            title: t('form.labelWidth'),
        }, {
            type: 'switch',
            field: 'hideRequiredAsterisk',
            value: false,
            title: t('form.hideRequiredAsterisk'),
        }, {
            type: 'switch',
            field: 'showMessage',
            value: true,
            title: t('form.showMessage'),
        }, {
            type: 'switch',
            field: 'inlineMessage',
            value: false,
            title: t('form.inlineMessage'),
        }, {
            type: 'switch',
            field: 'formCreateSubmitBtn',
            value: true,
            title: t('form.submitBtn'),
        }, {
            type: 'switch',
            field: 'formCreateResetBtn',
            value: false,
            title: t('form.resetBtn'),
        },  
        {
            type: 'MdpCrudApisCfg',
            field: 'crudApisCfg',
            title: t('form.crudApisCfg'),  
        }, 
    ];
}
