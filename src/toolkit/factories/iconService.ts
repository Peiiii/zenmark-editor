import { IconType } from "react-icons";

// 定义图标服务的接口
interface IconService {
  registerIcon: (name: string, icon: IconType) => void;
  getIcon: (name: string) => IconType | undefined;
}

// 实现图标服务
class IconServiceImpl implements IconService {
  private icons: Record<string, IconType> = {};

  registerIcon(name: string, icon: IconType) {
    this.icons[name] = icon;
  }

  getIcon(name: string) {
    return this.icons[name];
  }
}

export const createIconService = () => new IconServiceImpl();
