package com.lsvp.InventoryManagement.service.Report;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.lsvp.InventoryManagement.repository.ICategoryRepository;
import com.lsvp.InventoryManagement.repository.IProductRepository;
import com.lsvp.InventoryManagement.repository.IUnitRepository;
import com.lsvp.InventoryManagement.service.CategoryService;
import com.lsvp.InventoryManagement.service.ProductService;
import com.lsvp.InventoryManagement.service.UnitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.document.AbstractPdfView;

import java.io.IOException;

@Service
public class StockReportService {
    @Autowired
    private CategoryService category_service;
    @Autowired
    private ICategoryRepository category_repository;

    @Autowired
    private ProductService product_service;
    @Autowired
    private IProductRepository product_repository;

    @Autowired
    private UnitService unit_service;
    @Autowired
    private IUnitRepository unit_repository;

    public void export(HttpServletResponse response) throws DocumentException, IOException
    {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        document.add(new Paragraph("Texto de teste"));

        document.close();
    }
}
