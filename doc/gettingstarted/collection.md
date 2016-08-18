# Collections

`Collection` makes `Backbone.Collection` methods `fetch` and `create` to return a Promise. Besides it
exposes a helper `orderBy` that fires `"change"` event to make the bound view re-synchronize.

```javascript
export class Collection extends Backbone.Collection<Backbone.Model> {
  orderBy( key: string ): Collection;
  fetch( options: Backbone.ModelFetchOptions = {} ): Promise<any>;
  create( attributes: any, options: Backbone.ModelSaveOptions = {} ): Promise<any>;
}
```

#### Example:

```javascript

 class TestCollection extends Collection {
   url= "./mock";
 }

 let test = new TestCollection();
 test.fetch()
    .then(( collection: Collection ) => {
      // handle model
    })
    .catch(( err: Error ) => {
      // handle err
    });
```

