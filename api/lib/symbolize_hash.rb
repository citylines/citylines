def symbolize_hash(obj)
  return obj.reduce({}) do |memo, (k, v)|
    memo.tap { |m| m[k.to_sym] = symbolize_hash(v) }
  end if obj.is_a? Hash

  return obj.reduce([]) do |memo, v|
    memo << symbolize_hash(v); memo
  end if obj.is_a? Array

  obj
end
