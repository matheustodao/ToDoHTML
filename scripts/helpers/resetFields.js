export function resetFields(...fields) {
  return fields.map((field) => field['value'] = '' )
}
