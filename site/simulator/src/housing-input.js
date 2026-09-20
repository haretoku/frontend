const fallbackHousingContract = { default: 'existing', url_parameter_name: 'housingAge', options: [{value:'existing',label:'既存住宅'},{value:'new',label:'新築住宅'}] };
export function housingContract(contract) { return contract ?? fallbackHousingContract; }
export function configureHousingInput(select, contract) {
 const settings = housingContract(contract);
 const options = settings.options.map(item => { const option = document.createElement('option'); option.value=item.value; option.textContent=item.label; return option; });
 select.replaceChildren(...options); select.value=settings.default;
}
export function housingInput(value, contract) {
  const settings = housingContract(contract);
  if (value == null) return { value: settings.default, source: 'default' };
  if (!settings.options.some(item => item.value === value)) throw new Error('住宅区分は「既存住宅」または「新築住宅」を選択してください．');
  return { value, source: 'user_input' };
}
export function housingLabel(value, contract) { const settings=housingContract(contract); return settings.options.find(item=>item.value===housingInput(value,settings).value).label; }
