function TagList({ values, placeholder }) {
  if (!values.length) {
    return <span className="placeholder">{placeholder}</span>
  }

  return (
    <div className="tag-list">
      {values.map((value) => (
        <span className="tag" key={value}>
          {value}
        </span>
      ))}
    </div>
  )
}

export default TagList
