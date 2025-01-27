import React, { Component } from "react";
import { SuggestionPanel } from "./SuggestionPanel"; // 确保路径正确
import { SuggestionItem } from "@/actions/types";

class CommandList extends Component<
  {
    items: SuggestionItem[];
    command: (item: SuggestionItem) => void;
  },
  any
> {
  state = {
    selectedId: undefined,
  };

  componentDidMount(): void {
    if (this.props.items.length > 0) {
      this.setState({
        selectedId: this.props.items[0]?.id,
      });
    }
  }

  componentDidUpdate(oldProps) {
    if (this.props.items !== oldProps.items && this.props.items.length > 0) {
      this.setState({
        selectedId: this.props.items[0]?.id,
      });
    }
  }

  onKeyDown = ({ event }) => {
    if (event.key === "ArrowUp") {
      this.upHandler();
      return true;
    }

    if (event.key === "ArrowDown") {
      this.downHandler();
      return true;
    }

    if (event.key === "Enter") {
      this.enterHandler();
      return true;
    }

    return false;
  };

  upHandler = () => {
    const currentIndex = this.props.items.findIndex(
      (item) => item.id === this.state.selectedId
    );
    const newIndex =
      (currentIndex - 1 + this.props.items.length) % this.props.items.length;
    this.setState({ selectedId: this.props.items[newIndex].id });
  };

  downHandler = () => {
    const currentIndex = this.props.items.findIndex(
      (item) => item.id === this.state.selectedId
    );
    const newIndex = (currentIndex + 1) % this.props.items.length;
    this.setState({ selectedId: this.props.items[newIndex].id });
  };

  enterHandler = () => {
    this.selectItem(this.state.selectedId);
  };

  selectItem = (id) => {
    const item = this.props.items.find((item) => item.id === id);
    if (item) {
      this.props.command(item);
    }
  };

  render() {
    const { items } = this.props;
    const selectedIndex = items.findIndex(
      (item) => item.id === this.state.selectedId
    );
    return (
      <SuggestionPanel
        items={items}
        selectedIndex={selectedIndex}
        selectItem={(index) => this.selectItem(items[index].id)}
      />
    );
  }
}

export default CommandList;
