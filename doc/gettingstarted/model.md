# Models

`Model` makes `Backbone.Model` methods `fetch`, `save` and `destroy` to return a Promise

```javascript
export class Model extends Backbone.Model {
  destroy( options: Backbone.ModelDestroyOptions = {} ): Promise<any>;
  save( attributes?: any, options: Backbone.ModelSaveOptions = {} ): Promise<any>;
  fetch( options: Backbone.ModelFetchOptions = {} ): Promise<any>;
}
```

#### Example:

```javascript

 class TestModel extends Model {
   url= "./api/";
 }

 let test = new TestModel();
 test.fetch()
    .then(( model: Model ) => {
      // handle model
    })
    .catch(( err: Error ) => {
      // handle err
    });
```

