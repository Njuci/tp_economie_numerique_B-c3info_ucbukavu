// les variables
const cartBtn =document.querySelector('.cart-btn');
const fermerlepanier=document.querySelector('.close-cart');
const reinitialiserlepanier=document.querySelector('.clear-cart');
const cartDom=document.querySelector('.cart');
const preview=document.querySelector('.cart-overlay');
const Itemspanier=document.querySelector('.cart-items');
const totalpanier=document.querySelector('.cart-total');
const contenupanier=document.querySelector('.cart-content');
const prodDom=document.querySelector('.products-center');



const ajouPan=document.querySelectorAll('.bag-btn');
console.log(ajouPan);
// panier
let cart=[];
let DomBoutons=[];

//les gateaux


class Product{
  async getProducts(){
    
       try{
        let result= await fetch('products.json');
        let data= await result.json();
        let gateaux= data.items;
        gateaux =gateaux.map(item =>{
            const {title,price}=item.fields;
            const {id}=item.sys;
            const image=item.fields.image.fields.file.url;
            return {title,price,id,image}
        }) 
        return gateaux 
    

       }catch(error){
        console.log(error);
       }
    }

}
//utilisateur
class UI{
    displayProduct(products){
        console.log(products);
        let result='';
        products.forEach(element => {
            result +=`
            <article class="product">
                <div class="img-container">
                    <img src=${element.image} alt="gat" class="product-img">
                    <button class="bag-btn" data-id=${element.id}> 
                        <i class="fas fa-shopping-cart"></i>
                        Ajouter au Panier  </button>                    
                </div>
                <h3> ${element.title} </h3>
                 <h4>${element.price} FC</h4>
            </article>`;
                     
        });
        prodDom.innerHTML=result;
    }
    getbtn(){
        const ajouPabtnsn=[...document.querySelectorAll('.bag-btn')];
        DomBoutons=ajouPabtnsn;
       
        ajouPabtnsn.forEach( bouton =>{
            let id=bouton.dataset.id;
            let inCart=cart.find(item => item.id===id);
            if(inCart){
                bouton.innerText="IN text";
                bouton.disabled=true;
            }else{
                //ici on a les actions à faire à chaque clik sur un bouton "Ajouter au panier"
                //
                bouton.addEventListener("click",(event)=>{
                    event.target.innerText="dans le panier";
                    //une fois que le boutton est cliqué on ne veut que l' utilisateur ne tape enore le même produit deux fois 
                    event.target.disabled=true; 
                    let cartItem={...storage.getGateau(id),amount:1};
                    cart=[...cart,cartItem];
                    storage.sauvegardePannier(cart);
                    this.sauvegardeValeursPannier(cart);
                    this.ajouterPannierHtml(cartItem);
                   
                });
            }
        }

        );
    }

    sauvegardeValeursPannier(crt){
        let totalpanie=0;
        let cartItemsTotalg=0;
        crt.map(item =>{
            totalpanie += item.price *item.amount;
            cartItemsTotalg +=item.amount;
        });
        totalpanier.innerText=parseFloat(totalpanie.toFixed(2));
        Itemspanier.innerText  = cartItemsTotalg;
        console.log(totalpanier,Itemspanier);
    }
    ajouterPannierHtml(item){
        const addItem= document.createElement('div');
        addItem.classList.add('cart-item');
        addItem.innerHTML=`
    
        <img src=${item.image} alt=${item.id}>
        <div >
            <h4> ${item.title}  </h4>
            <h5> ${item.price} FC </h5>
            <span class="remove-item" data-id=${item.id}>Supprimer </span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>        
        `;
        contenupanier.appendChild(addItem);
        console.log(contenupanier);
        
    }
    afficherLacommande(){
        preview.classList.add('transparentBcg');
        cartDom.classList.add('showCart');

    }
    cacher(){
        preview.classList.remove('transparentBcg');
        cartDom.classList.remove('showCart');
    }
    lancement(){
        const st=new storage();
        cart=this.voirlepanier();
        this.sauvegardeValeursPannier(cart);
        this.publiCart(cart);
        cartBtn.addEventListener('click',this.afficherLacommande);
        fermerlepanier.addEventListener('click',this.cacher);


    }
    publiCart(cart){
        cart.forEach(el =>this.ajouterPannierHtml(el)); 
    }
    voirlepanier(){
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }
    sotirdanslepanier(id){
        cart=cart.filter(element => element.id !==id);
        this.sauvegardeValeursPannier(cart);
        storage.sauvegardePannier(cart);
        let bouton=this.getButton(id);
        bouton.disabled=false;
        bouton.innerHTML=`<i class="fas fa-shopping-cart"></i> Ajouter au Panier`;

    }
    getButton(id){
        return DomBoutons.find(bouton =>bouton.dataset.id === id)
    }
    clearpanier(){
        let itemsCart=cart.map(item=>item.id);
        itemsCart.forEach(id=>this.sotirdanslepanier(id));
        while (contenupanier.children.length>0) {
            contenupanier.removeChild(contenupanier.children[0])            
        }
        this.cacher();
    }
    reinitialiserCart(){
        reinitialiserlepanier.addEventListener('click',()=>{
            this.clearpanier();
        });

    }
}

class storage{
    static sauvegardeDonneeLclmt(gateau){
        localStorage.setItem("products",JSON.stringify(gateau));
    }
    static sauvegardePannier(cart){
        localStorage.setItem('cart',JSON.stringify(cart));
    }
    static getGateau(id){
        let gateau= JSON.parse(localStorage.getItem('products'));
        return gateau.find(gateaux => gateaux.id ===id)
    }
    static voirlepanier(){
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    }

}
document.addEventListener("DOMContentLoaded",()=>{
    const ui=new UI();
    const product=new Product();
    // lancement
    ui.lancement();


    //tous les gateaux
    product.getProducts().then(data => {
        ui.displayProduct(data);
        storage.sauvegardeDonneeLclmt(data);
    }).then(()=>{
        ui.getbtn();
        ui.reinitialiserCart();

    });
    }
);  