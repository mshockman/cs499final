import $ from 'jquery';
import '@babel/polyfill';
import CategoryWindow from './CategoryWindow';


class TreeView {
    constructor(selector) {
        this.element = document.querySelector(selector);

        this._onClick = this.onClick.bind(this);
        this.element.addEventListener('click', this._onClick);
    }

    onClick(event) {
        let item = event.target.closest('.tree-item');

        for(let selected of this.element.querySelectorAll('.tree-item.active')) {
            if(selected !== item) selected.classList.remove('active');
        }

        if(item) {
            item.classList.add('active');
        }
    }

    empty() {
        return $(this.element).find('.root-node .tree-menu').empty();
    }

    removeNode(id) {
        if(id === 'all') {
            return this.empty();
        }

        $(this.element).find(`[data-id="${id}"]`).remove();
    }

    getSelected() {
        let item = this.element.querySelector('.tree-item.active');

        if(item) {
            return item.closest('.tree-menuitem');
        }
    }

    static getMenu(parent) {
        for(let node of parent.children) {
            if(node.classList.contains('tree-menu')) {
                return node;
            }
        }
    }

    addRoot({id, name}) {
        let node = document.createElement('div');
        node.dataset.depth = '1';
        node.dataset.id = ''+id;
        node.dataset.children = '0';
        node.classList.add('tree-menuitem');

        let item = document.createElement('div');
        item.classList.add('tree-item');
        item.appendChild(document.createTextNode(name));
        item.style.paddingLeft = '1.5rem';
        node.appendChild(item);

        this.element.appendChild(node);

        return node;
    }

    appendItem(parent, {id, name}) {
        if(!parent) {
            return this.addRoot({id, name});
        }

        if(parent.matches('.tree-item')) {
            parent = parent.closest('.tree-menuitem');
        }

        // depth, id, children, .has-children

        let menu = TreeView.getMenu(parent),
            depth = parseInt(parent.dataset.depth) || 0;

        if(!menu) {
            menu = document.createElement('div');
            menu.classList.add('tree-menu');
            parent.appendChild(menu);
        }

        let node = document.createElement('div'),
            item = document.createElement('div');

        node.classList.add('tree-menuitem');
        item.classList.add('tree-item');
        item.appendChild(document.createTextNode(name));
        node.dataset.id = ""+id;
        node.dataset.children = '0';
        node.dataset.depth = ''+(depth+1);
        item.style.paddingLeft = ((depth+1) * 1.5) + 'rem';

        node.appendChild(item);
        menu.appendChild(node);

        // Update parent
        parent.classList.add('has-children');
    }
}


$(() => {
    let tree = new TreeView("#category-tree");

    document.querySelector('#create-category-btn').addEventListener('click', async (event) => {
        let selected = tree.getSelected(),
            id = selected ? selected.dataset.id : null;

        let name = prompt("Category Name:");

        if(name === null) {
            return;
        }

        let response = await fetch('/ajax/category/create', {
                'method': "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'parent': id,
                    'name': name
                })
            }),
            data = await response.json();

        console.log(data);
        console.log(response.status);
        console.log(response.statusText);

        if(response.status !== 200) {
            alert(data['error']);
        } else {
            tree.appendItem(selected, data);
        }
    });

    document.querySelector('#remove-category-btn').addEventListener('click', async (event) => {
        let selected = tree.getSelected(),
            id = selected ? selected.dataset.id : null,
            deletaAll = false;

        if(!selected) {
            alert("No Category Selected");
            return;
        }

        if(!id) {
            if(!confirm("If you delete the root node all categories will be deleted.  Are you sure?")) return;
            deletaAll = true;
        } else {
            if(!confirm("Are you sure you want to delete this category?")) return;
        }

        let response = await fetch('/ajax/category/remove', {
                'method': "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'id': id,
                    'deleteAll': deletaAll
                })
            }),
            data = await response.json();

        if(response.status !== 200) {
            alert(data['error']);
        }

        tree.removeNode(data.deleted);
    });

    document.querySelector('#add-and-remove-items-btn').addEventListener('click', (event) => {
        let selected = tree.getSelected(),
            id = selected ? selected.dataset.id : null;

        if(!id) {
            alert("No Category Selected!");
            return;
        }

        let wnd = new CategoryWindow(id);
        wnd.appendTo(document.body);
        wnd.open();
    });

    document.querySelector('#browse-category-btn').addEventListener('click', (event) => {
        let selected = tree.getSelected(),
            id = selected ? selected.dataset.id : null;

        if(!id) {
            alert("No Category Selected!");
            return;
        }

        window.location = `/?category=${id}`;
    });
});
