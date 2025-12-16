package com.lsvp.InventoryManagement.controller;


import com.lowagie.text.DocumentException;
import com.lsvp.InventoryManagement.dto.Product.ProductCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductUpdateDTO;
import com.lsvp.InventoryManagement.dto.User.UserDTO;
import com.lsvp.InventoryManagement.dto.User.UserUpdateDTO;
import com.lsvp.InventoryManagement.service.ProductService;
import com.lsvp.InventoryManagement.service.Report.StockReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Products", description = "Gerenciamento dos Produtos")
@RequestMapping("api/product")

public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private StockReportService stockReportService;

        @PostMapping
        @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ESTOQUISTA')")
        public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductCreateDTO dto){

            return ResponseEntity.ok(productService.createProduct(dto));
        }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "20") int limit,
        @RequestParam(defaultValue = "id,desc") String sort,
        @RequestParam(required = false) String gtin,
        @RequestParam(required = false) String category
    ){
        Page<ProductDTO> result = productService.getAllProductsSorted(page, limit, sort, gtin, category);
        return ResponseEntity.ok(result);
    }
        
        @GetMapping("/{id}")
        public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id){
            return ResponseEntity.ok(productService.getProductById(id));
        }

        @GetMapping("/gtin/{gtin}")
        public ResponseEntity<ProductDTO> getProductByGtin(@PathVariable String gtin){
            return ResponseEntity.ok(productService.getProductByGtin(gtin));
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ESTOQUISTA')")
        public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductUpdateDTO dto){

            return ResponseEntity.ok(productService.updateProduct(id, dto));
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ESTOQUISTA')")
        public ResponseEntity<Void> deleteProduct(@PathVariable Long id){

            productService.deleteProduct(id);

            return ResponseEntity.ok().build();
        }

        @GetMapping("/export")
        public void exportToPDF(HttpServletResponse response) throws DocumentException, IOException
        {
            response.setContentType("application/pdf");
            String headerKey = "Content-Disposition";
            String headerValue = "attachment; filename=Estoque_Geral.pdf";

            response.setHeader(headerKey, headerValue);

            StockReportService stockReport = new StockReportService();
            stockReport.export(response);
        }
}
