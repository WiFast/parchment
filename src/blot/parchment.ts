import Blot from './abstract/blot';
import ContainerBlot from './container';
import LinkedList from '../collection/linked-list';
import ParentBlot from './abstract/parent';
import * as Registry from '../registry';


const OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
};

class ParchmentBlot extends ContainerBlot {
  static blotName = 'parchment';
  static tagName = 'DIV';

  children: LinkedList<ContainerBlot>;
  observer: MutationObserver;
  dirty: boolean;

  constructor(node: Node) {
    super(node);
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.update(mutations);
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
    this.dirty = false;
  }

  deleteAt(index: number, length: number) {
    this.dirty = true;
    this.observer.disconnect();
    super.deleteAt(index, length);
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
  }

  format(name: string, value: any) {
    this.dirty = true;
    this.observer.disconnect();
    super.format(name, value);
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
  }

  formatAt(index: number, length: number, name: string, value: any) {
    this.dirty = true;
    this.observer.disconnect();
    super.formatAt(index, length, name, value);
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
  }

  insertAt(index: number, value: string, def?: any) {
    this.dirty = true;
    this.observer.disconnect();
    super.insertAt(index, value, def);
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
  }

  update(mutations: MutationRecord);
  update(mutations?: MutationRecord[]);
  update(mutations: any) {
    if (mutations instanceof MutationRecord) {
      return super.update(mutations);
    } else if (mutations == null) {
      mutations = this.observer.takeRecords();
    }
    this.observer.disconnect();
    mutations.forEach((mutation: MutationRecord) => {
      let blot = Blot.findBlot(mutation.target, true);
      if (blot != null) {
        blot.update(mutation);
      }
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
    this.dirty = false;
  }
}


export default ParchmentBlot;