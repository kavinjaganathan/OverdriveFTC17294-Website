// Notched pennant banner (purple body, striped tips). Set --pennant-fill on an ancestor to recolour the body.
export default function Pennant({ as: Tag = 'h2', className = '', children, ...rest }) {
  return <Tag className={`pennant ${className}`.trim()} {...rest}>{children}</Tag>
}
