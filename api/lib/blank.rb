# Taken from http://stackoverflow.com/a/16328457/3095803

class NilClass
  def blank?
    true
  end
end

class String
  def blank?
    self.strip.empty?
  end
end

class FalseClass
  def blank?
    true
  end
end

class TrueClass
  def blank?
    false
  end
end

class Object
  def blank?
    respond_to?(:empty?) ? empty? : !self
  end
end
