# NG.Backbone + SystemJS • Hero Cards

This is a simple app demonstrating <a href="https://github.com/dsheiko/ng-backbone">NgBackbone</a>.
You can enter hero name and power in the form and form gets validated automatically.
It requires no additional <a href="https://github.com/dsheiko/ng-backbone/blob/master/demo/src/View/Hero.ts">code in the view</a>. The hero card gets stored in local storage and
appears in the list below. You can sort the list, select and remove items.
That also almost doesn't need to be supported by <a href="https://github.com/dsheiko/ng-backbone/blob/master/demo/src/View/HeroList.ts">view code</a>.


#### Updating dependencies

```
bower install
sudo npm install typescript -g
```

#### Building project

```
tsc -p demo
```

## Note

If you work with NetBeans IDE, I recommend to install incredible [TypeScript Editor plugin](https://github.com/Everlaw/nbts),
that validates declared interfaces on-the-fly, warning you you about problems, bringing a really new development experience