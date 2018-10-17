

def dictset(dic, path, value):
    if path isinstance list:
        if len(path) == 1:
            dic[path[0]] = value
        else:
            dictset(dic[path[0]], path[1:], value)
    else:
        dic[path] = value